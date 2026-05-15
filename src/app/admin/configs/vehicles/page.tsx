'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Button, Upload, Modal, Input, Segmented, message,
  Table, Form, Space, Popconfirm, Tooltip, Drawer, Descriptions, ConfigProvider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UploadOutlined, DownloadOutlined, SearchOutlined, CheckCircleFilled,
  PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import { INITIAL_VEHICLE_DATA, INITIAL_VEHICLE_DATA_SANDBOX, type VehicleData } from '../mock-data';

const STORAGE_KEYS = {
  production: 'admin_config_vehicles_flat_production',
  sandbox: 'admin_config_vehicles_flat_sandbox',
} as const;
type Env = keyof typeof STORAGE_KEYS;

interface FlatRow {
  id: string;
  market: string;
  city: string;
  serviceType: string;
  displayName: string;
  displayNameZh: string;
  imageUrl: string;
  srKey: string;
  srName: string;
  srNameZh: string;
  srDesc: string;
}

function vehicleDataToRows(data: VehicleData): FlatRow[] {
  const rows: FlatRow[] = [];
  let i = 0;
  for (const [market, cities] of Object.entries(data)) {
    for (const [city, vehicles] of Object.entries(cities)) {
      for (const v of vehicles) {
        const base = { market, city, serviceType: v.key, displayName: v.enName, displayNameZh: v.zhName, imageUrl: v.imageUrl };
        if (v.specialRequests.length === 0) {
          rows.push({ id: `r${i++}`, ...base, srKey: '', srName: '', srNameZh: '', srDesc: '' });
        } else {
          for (const sr of v.specialRequests) {
            rows.push({ id: `r${i++}`, ...base, srKey: sr.name, srName: sr.enName, srNameZh: sr.zhName, srDesc: sr.parent_enName });
          }
        }
      }
    }
  }
  return rows;
}

function useRows(env: Env) {
  const [rows, setRows] = useState<FlatRow[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS[env]);
      if (stored) {
        setRows(JSON.parse(stored));
      } else {
        const initial = vehicleDataToRows(env === 'production' ? INITIAL_VEHICLE_DATA : INITIAL_VEHICLE_DATA_SANDBOX);
        setRows(initial);
        localStorage.setItem(STORAGE_KEYS[env], JSON.stringify(initial));
      }
    } catch {
      setRows(vehicleDataToRows(env === 'production' ? INITIAL_VEHICLE_DATA : INITIAL_VEHICLE_DATA_SANDBOX));
    }
  }, [env]);
  const save = (next: FlatRow[]) => { setRows(next); localStorage.setItem(STORAGE_KEYS[env], JSON.stringify(next)); };
  return { rows, save };
}

// ─── Field definitions (label + dataIndex) in display order ───────────────────
const FIELDS: { label: string; key: keyof Omit<FlatRow, 'id'>; required?: boolean }[] = [
  { label: 'Market',                    key: 'market',        required: true },
  { label: 'City',                      key: 'city',          required: true },
  { label: 'API serviceType',           key: 'serviceType',   required: true },
  { label: 'WebApp Display Name',       key: 'displayName',   required: true },
  { label: 'WebApp Display Name (ZH)',  key: 'displayNameZh' },
  { label: 'vehicle image URL',         key: 'imageUrl' },
  { label: 'API specialRequest',        key: 'srKey' },
  { label: 'specialRequest Name',       key: 'srName' },
  { label: 'specialRequest Name (ZH)',  key: 'srNameZh' },
  { label: 'specialRequest description',key: 'srDesc' },
];

const EMPTY_ROW: Omit<FlatRow, 'id'> = {
  market: '', city: '', serviceType: '', displayName: '', displayNameZh: '',
  imageUrl: '', srKey: '', srName: '', srNameZh: '', srDesc: '',
};

// ─── Row Drawer ───────────────────────────────────────────────────────────────
function RowDrawer({ row, onClose, onSave, onDelete }: {
  row: FlatRow | null;
  onClose: () => void;
  onSave: (updated: FlatRow) => void;
  onDelete: (id: string) => void;
}) {
  const [form] = Form.useForm();
  const isNew = row?.id === '__new__';
  const [editing, setEditing] = useState(isNew);

  useEffect(() => {
    if (row) { form.setFieldsValue(row); setEditing(row.id === '__new__'); }
    else form.resetFields();
  }, [row, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      onSave({ ...values, id: isNew ? `r${Date.now()}` : row!.id });
      onClose();
    });
  };

  const handleDelete = () => {
    if (row) { onDelete(row.id); onClose(); }
  };

  return (
    <Drawer
      open={!!row}
      onClose={onClose}
      title={isNew ? '新增' : '详情'}
      width={480}
      extra={
        <Space>
          {!isNew && !editing && (
            <>
              <Popconfirm title="确认删除该行？" okText="删除" cancelText="取消"
                okButtonProps={{ danger: true }} onConfirm={handleDelete}>
                <Button danger size="small" icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
              <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(true)}>编辑</Button>
            </>
          )}
          {editing && !isNew && (
            <Button size="small" onClick={() => { form.setFieldsValue(row!); setEditing(false); }}>取消</Button>
          )}
          {editing && (
            <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
          )}
        </Space>
      }
    >
      {editing ? (
        <Form form={form} layout="vertical">
          {FIELDS.map(f => (
            <Form.Item key={f.key} label={f.label} name={f.key}
              rules={f.required ? [{ required: true, message: `请填写 ${f.label}` }] : []}>
              {f.key === 'imageUrl' ? <Input.TextArea rows={2} placeholder="https://..." /> : <Input />}
            </Form.Item>
          ))}
        </Form>
      ) : (
        <Descriptions column={1} size="small" bordered
          items={FIELDS.map(f => ({
            key: f.key,
            label: f.label,
            children: row?.[f.key] || <span className="text-gray-300">—</span>,
          }))}
        />
      )}
    </Drawer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VehiclesPage() {
  const [env, setEnv] = useState<Env>('production');
  const { rows, save } = useRows(env);
  const [keyword, setKeyword] = useState('');
  const [drawerRow, setDrawerRow] = useState<FlatRow | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const markets = useMemo(() => [...new Set(rows.map(r => r.market))], [rows]);

  const filtered = useMemo(() => {
    if (!keyword) return rows;
    const kw = keyword.toLowerCase();
    return rows.filter(r =>
      r.market.toLowerCase().includes(kw) ||
      r.city.toLowerCase().includes(kw) ||
      r.serviceType.toLowerCase().includes(kw) ||
      r.displayName.toLowerCase().includes(kw) ||
      r.displayNameZh.toLowerCase().includes(kw) ||
      r.srKey.toLowerCase().includes(kw) ||
      r.srName.toLowerCase().includes(kw)
    );
  }, [rows, keyword]);

  const handleSave = (updated: FlatRow) => {
    const exists = rows.find(r => r.id === updated.id);
    if (exists) {
      save(rows.map(r => r.id === updated.id ? updated : r));
      messageApi.success('已更新');
    } else {
      save([...rows, updated]);
      messageApi.success('已新增');
    }
  };

  const handleDelete = (id: string) => {
    save(rows.filter(r => r.id !== id));
    messageApi.success('已删除');
  };

  const handleExport = () => {
    const data = rows.map(r => ({
      'Market': r.market, 'City': r.city,
      'API serviceType': r.serviceType,
      'WebApp Display Name': r.displayName,
      'WebApp Display Name (ZH)': r.displayNameZh,
      'vehicle image URL': r.imageUrl,
      'API specialRequest': r.srKey,
      'specialRequest Name': r.srName,
      'specialRequest Name (ZH)': r.srNameZh,
      'specialRequest description': r.srDesc,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '车型数据');
    XLSX.writeFile(wb, `lalamove_${env === 'production' ? '正式环境' : '沙盒环境'}_车型数据.xlsx`);
    messageApi.success('导出成功');
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: () => { setImportModal(true); return false; },
  };

  const columns: ColumnsType<FlatRow> = [
    { title: 'Market',                    dataIndex: 'market',       key: 'market',       width: 110, fixed: 'left' },
    { title: 'City',                      dataIndex: 'city',         key: 'city',         width: 150, fixed: 'left' },
    { title: 'API serviceType',           dataIndex: 'serviceType',  key: 'serviceType',  width: 160,
      render: v => <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{v}</span> },
    { title: 'WebApp Display Name',       dataIndex: 'displayName',  key: 'displayName',  width: 160 },
    { title: 'WebApp Display Name (ZH)',  dataIndex: 'displayNameZh',key: 'displayNameZh',width: 160 },
    { title: 'vehicle image URL',         dataIndex: 'imageUrl',     key: 'imageUrl',     width: 140,
      render: v => v ? (
        <Tooltip title={v}>
          <a href={v} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 underline font-mono block truncate max-w-[120px]">{v}</a>
        </Tooltip>
      ) : <span className="text-gray-300">—</span> },
    { title: 'API specialRequest',        dataIndex: 'srKey',        key: 'srKey',        width: 180,
      render: v => v ? <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{v}</span> : <span className="text-gray-300">—</span> },
    { title: 'specialRequest Name',       dataIndex: 'srName',       key: 'srName',       width: 180,
      render: v => v || <span className="text-gray-300">—</span> },
    { title: 'specialRequest Name (ZH)',  dataIndex: 'srNameZh',     key: 'srNameZh',     width: 160,
      render: v => v || <span className="text-gray-300">—</span> },
    { title: 'specialRequest description',dataIndex: 'srDesc',       key: 'srDesc',       width: 180, ellipsis: true,
      render: v => v || <span className="text-gray-300">—</span> },
  ];

  const tableProps = {
    size: 'small' as const,
    scroll: { x: 1700 },
    onRow: (record: FlatRow) => ({ onClick: () => setDrawerRow(record), className: 'cursor-pointer hover:bg-blue-50' }),
  };

  return (
    <>
      {contextHolder}

      <div className="flex items-center justify-between mb-5">
        <ConfigProvider theme={{ components: { Segmented: { itemSelectedColor: '#2257D4' } } }}>
          <Segmented
            value={env}
            onChange={k => { setEnv(k as Env); setKeyword(''); }}
            options={[{ value: 'production', label: '正式环境' }, { value: 'sandbox', label: '沙盒环境' }]}
          />
        </ConfigProvider>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{markets.length} 个市场 · 共 {rows.length} 行</span>
          <Button size="small" icon={<PlusOutlined />}
            onClick={() => setDrawerRow({ id: '__new__', ...EMPTY_ROW })}>新增</Button>
          <Upload {...uploadProps}>
            <Button size="small" icon={<UploadOutlined />}>上传 Excel 替换</Button>
          </Upload>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleExport}>下载当前配置</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="搜索 Market、City、serviceType、Display Name、specialRequest..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>

      <Table dataSource={filtered} columns={columns} rowKey="id"
        {...tableProps}
        pagination={{ pageSize: 50, hideOnSinglePage: true }} />

      <RowDrawer
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Modal open={importModal} onCancel={() => setImportModal(false)} title={null}
        footer={<Button type="primary" onClick={() => setImportModal(false)}>确认</Button>}
        width={440} centered>
        <div className="py-4">
          <div className="flex items-center gap-3 mb-5">
            <CheckCircleFilled className="text-green-500 text-3xl" />
            <div>
              <div className="text-base font-semibold text-gray-900">
                导入成功（{env === 'production' ? '正式环境' : '沙盒环境'}）
              </div>
              <div className="text-sm text-gray-500 mt-0.5">车型映射数据已全量替换</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">共导入行数</span><span className="font-medium">3,410 行</span></div>
            <div className="flex justify-between"><span className="text-gray-600">涉及市场</span><span className="font-medium">4 个</span></div>
            <div className="flex justify-between"><span className="text-gray-600">涉及城市</span><span className="font-medium">18 个</span></div>
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              {[
                { market: 'Indonesia', rows: 1402 },
                { market: 'Malaysia',  rows: 623 },
                { market: 'Thailand',  rows: 891 },
                { market: 'Vietnam',   rows: 494 },
              ].map(row => (
                <div key={row.market} className="flex justify-between text-gray-500">
                  <span>{row.market}</span><span>{row.rows} 行</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
