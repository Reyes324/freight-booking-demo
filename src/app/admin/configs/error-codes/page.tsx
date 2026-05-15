'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, InputNumber, Popconfirm,
  Upload, Tag, message, Space, Drawer, Select, Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined,
  SearchOutlined, CheckCircleFilled, SaveOutlined, EditOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import {
  INITIAL_ERROR_CODES, CATEGORY_LABELS, getCategory,
  type ErrorCode, type ErrorCodeCategory,
} from '../mock-data';

const STORAGE_KEY = 'admin_config_error_codes';

const CATEGORY_COLORS: Record<ErrorCodeCategory, string> = {
  general: 'blue',
  user: 'green',
  order: 'orange',
  lalamove: 'purple',
};

const CATEGORY_SHORT: Record<ErrorCodeCategory, string> = {
  general: '通用错误',
  user: '用户服务错误',
  order: '订单相关错误',
  lalamove: 'Lalamove供应商错误',
};

function useErrorCodes() {
  const [codes, setCodes] = useState<ErrorCode[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setCodes(stored ? JSON.parse(stored) : INITIAL_ERROR_CODES);
    } catch {
      setCodes(INITIAL_ERROR_CODES);
    }
  }, []);
  const save = (next: ErrorCode[]) => {
    setCodes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  return { codes, save };
}

const FIELDS: { label: string; key: keyof ErrorCode; required?: boolean; type?: 'number' | 'textarea' }[] = [
  { label: '分类',             key: 'category' },
  { label: '错误码',           key: 'code',         required: true, type: 'number' },
  { label: '枚举名',           key: 'enumName',     required: true },
  { label: 'Key',              key: 'key',          required: true },
  { label: '原始说明',         key: 'originalDesc' },
  { label: '用户提示（中文）', key: 'zhTip',        required: true, type: 'textarea' },
  { label: '用户提示（英文）', key: 'enTip',        required: true, type: 'textarea' },
  { label: '场景说明',         key: 'scenario',     type: 'textarea' },
];

const EMPTY: Omit<ErrorCode, 'id' | 'category'> = {
  code: 0, enumName: '', key: '', originalDesc: '', zhTip: '', enTip: '', scenario: '',
};

// ─── Row Drawer ───────────────────────────────────────────────────────────────
function RowDrawer({ row, onClose, onSave, onDelete }: {
  row: ErrorCode | null;
  onClose: () => void;
  onSave: (updated: ErrorCode) => void;
  onDelete: (id: string) => void;
}) {
  const [form] = Form.useForm();
  const isNew = row?.id === '__new__';
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (row) { form.setFieldsValue(row); setEditing(row.id === '__new__'); }
    else form.resetFields();
  }, [row, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      onSave({ ...values, id: isNew ? `ec-${Date.now()}` : row!.id });
      onClose();
    });
  };

  const handleDelete = () => {
    if (row) { onDelete(row.id); onClose(); }
  };

  const allFields = [
    { label: '分类', key: 'category', renderView: (v: string) => CATEGORY_SHORT[v as ErrorCodeCategory] ?? v },
    ...FIELDS.filter(f => f.key !== 'category').map(f => ({ ...f, renderView: undefined })),
  ];

  return (
    <Drawer
      open={!!row}
      onClose={onClose}
      title={isNew ? '新增错误码' : '详情'}
      width={480}
      extra={
        <Space>
          {!isNew && !editing && (
            <>
              <Popconfirm title="确认删除？" okText="删除" cancelText="取消"
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
          <Form.Item label="分类" name="category" rules={[{ required: true }]}>
            <Select
              options={(['general', 'user', 'order', 'lalamove'] as ErrorCodeCategory[]).map(cat => ({
                value: cat,
                label: <Tag color={CATEGORY_COLORS[cat]}>{CATEGORY_SHORT[cat]}</Tag>,
              }))}
            />
          </Form.Item>
          {FIELDS.filter(f => f.key !== 'category').map(f => (
            <Form.Item key={f.key} label={f.label} name={f.key}
              rules={f.required ? [{ required: true, message: `请填写 ${f.label}` }] : []}>
              {f.type === 'number' ? <InputNumber className="w-full" min={0} />
                : f.type === 'textarea' ? <Input.TextArea rows={2} />
                : <Input />}
            </Form.Item>
          ))}
        </Form>
      ) : (
        <Descriptions column={1} size="small" bordered
          items={allFields.map(f => ({
            key: f.key,
            label: f.label,
            children: f.renderView
              ? f.renderView(String(row?.[f.key as keyof ErrorCode] ?? ''))
              : (row?.[f.key as keyof ErrorCode] || <span className="text-gray-300">—</span>),
          }))}
        />
      )}
    </Drawer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ErrorCodesPage() {
  const { codes, save } = useErrorCodes();
  const [keyword, setKeyword] = useState('');
  const [drawerRow, setDrawerRow] = useState<ErrorCode | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const filtered = useMemo(() => {
    const list = keyword
      ? codes.filter(c => {
          const kw = keyword.toLowerCase();
          return (
            String(c.code).includes(kw) ||
            c.enumName.toLowerCase().includes(kw) ||
            c.key.toLowerCase().includes(kw) ||
            c.zhTip.toLowerCase().includes(kw) ||
            c.enTip.toLowerCase().includes(kw) ||
            CATEGORY_SHORT[c.category].toLowerCase().includes(kw)
          );
        })
      : codes;
    return [...list].sort((a, b) => a.code - b.code);
  }, [codes, keyword]);

  const handleSave = (updated: ErrorCode) => {
    const exists = codes.find(c => c.id === updated.id);
    if (exists) {
      save(codes.map(c => c.id === updated.id ? updated : c));
      messageApi.success('已更新');
    } else {
      save([...codes, updated]);
      messageApi.success('已新增');
    }
  };

  const handleDelete = (id: string) => {
    save(codes.filter(c => c.id !== id));
    messageApi.success('已删除');
  };

  const handleExport = () => {
    const rows = codes.sort((a, b) => a.code - b.code).map(c => ({
      '分类': CATEGORY_SHORT[c.category],
      '错误码': c.code,
      '枚举名': c.enumName,
      'Key': c.key,
      '原始说明': c.originalDesc,
      '用户提示（中文）': c.zhTip,
      '用户提示（英文）': c.enTip,
      '场景说明': c.scenario,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '错误码配置');
    XLSX.writeFile(wb, 'lalamove_api_错误码配置.xlsx');
    messageApi.success('导出成功');
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: () => { setImportModal(true); return false; },
  };

  const columns: ColumnsType<ErrorCode> = [
    {
      title: '分类', dataIndex: 'category', key: 'category', width: 160,
      render: (v: ErrorCodeCategory) => <span className="text-gray-600 text-xs">{CATEGORY_SHORT[v]}</span>,
    },
    {
      title: '错误码', dataIndex: 'code', key: 'code', width: 80,
      render: v => <span className="font-mono font-medium">{v}</span>,
    },
    {
      title: '枚举名', dataIndex: 'enumName', key: 'enumName', width: 180,
      render: v => <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{v}</span>,
    },
    {
      title: 'Key', dataIndex: 'key', key: 'key', width: 180,
      render: v => <span className="font-mono text-xs text-gray-500">{v}</span>,
    },
    {
      title: '原始说明', dataIndex: 'originalDesc', key: 'originalDesc', width: 160, ellipsis: true,
    },
    {
      title: '用户提示（中文）', dataIndex: 'zhTip', key: 'zhTip', width: 200,
    },
    {
      title: '用户提示（英文）', dataIndex: 'enTip', key: 'enTip', width: 240, ellipsis: true,
      render: v => <span className="text-gray-600 text-xs">{v}</span>,
    },
    {
      title: '场景说明', dataIndex: 'scenario', key: 'scenario', ellipsis: true,
      render: v => <span className="text-gray-500 text-xs">{v}</span>,
    },
  ];

  return (
    <>
      {contextHolder}

      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <Button size="small" icon={<PlusOutlined />}
            onClick={() => setDrawerRow({ id: '__new__', category: 'general', ...EMPTY })}>
            新增
          </Button>
          <Upload {...uploadProps}>
            <Button size="small" icon={<UploadOutlined />}>上传 Excel 替换</Button>
          </Upload>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleExport}>下载当前配置</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="搜索分类、错误码、枚举名、Key、用户提示..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: 1400 }}
        pagination={{ pageSize: 50, showTotal: t => `共 ${t} 条`, hideOnSinglePage: true }}
        onRow={record => ({
          onClick: () => setDrawerRow(record),
          className: 'cursor-pointer hover:bg-blue-50',
        })}
      />

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
              <div className="text-base font-semibold text-gray-900">导入成功</div>
              <div className="text-sm text-gray-500 mt-0.5">错误码配置已全量替换</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">共导入</span><span className="font-medium">47 条</span></div>
            <div className="flex justify-between"><span className="text-gray-600">新增</span><span className="font-medium text-green-600">3 条</span></div>
            <div className="flex justify-between"><span className="text-gray-600">更新</span><span className="font-medium text-blue-600">12 条</span></div>
            <div className="flex justify-between"><span className="text-gray-600">删除</span><span className="font-medium text-gray-400">0 条</span></div>
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1 text-gray-500">
              {[
                { label: '通用错误', count: 12 },
                { label: '用户服务错误', count: 5 },
                { label: '订单相关错误', count: 21 },
                { label: 'Lalamove供应商错误', count: 9 },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span>{row.label}</span><span>{row.count} 条</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
