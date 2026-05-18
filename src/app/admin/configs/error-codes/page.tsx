'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, InputNumber, Popconfirm,
  message, Space, Drawer, Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined,
  SearchOutlined, SaveOutlined, EditOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import {
  INITIAL_ERROR_CODES,
  type ErrorCode,
} from '../mock-data';

const STORAGE_KEY = 'admin_config_error_codes';

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
  { label: '错误码',           key: 'code',     required: true, type: 'number' },
  { label: '枚举名',           key: 'enumName', required: true },
  { label: '用户提示（中文）', key: 'zhTip',    required: true, type: 'textarea' },
  { label: '用户提示（英文）', key: 'enTip',    required: true, type: 'textarea' },
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
      {/* 查看态：左右布局 */}
      {!editing && (
        <div>
          {FIELDS.map(f => (
            <div key={f.key} className="flex items-start justify-between py-3 border-b border-gray-100 gap-4">
              <span className="text-xs text-gray-400 shrink-0 pt-0.5">{f.label}</span>
              <span className="text-sm text-gray-900 text-right break-all">
                {row?.[f.key as keyof ErrorCode] || <span className="text-gray-300">—</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 编辑态：表单 */}
      <Form form={form} layout="vertical" style={{ display: editing ? 'block' : 'none' }}>
        {FIELDS.map(f => (
          <Form.Item
            key={f.key}
            label={<span className="text-xs text-gray-500">{f.label}</span>}
            name={f.key}
            rules={f.required ? [{ required: true, message: `请填写 ${f.label}` }] : []}
          >
            {f.type === 'number' ? <InputNumber className="w-full" min={0} />
              : f.type === 'textarea' ? <Input.TextArea rows={2} />
              : <Input />}
          </Form.Item>
        ))}
      </Form>
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
            c.zhTip.toLowerCase().includes(kw) ||
            c.enTip.toLowerCase().includes(kw)
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
      '错误码': c.code,
      '枚举名': c.enumName,
      '用户提示（中文）': c.zhTip,
      '用户提示（英文）': c.enTip,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '错误码配置');
    XLSX.writeFile(wb, 'lalamove_api_错误码配置.xlsx');
    messageApi.success('导出成功');
  };

  const handleImportConfirm = () => {
    Modal.confirm({
      title: '确认导入？',
      content: '导入后将覆盖当前错误码配置，此操作不可撤销。',
      okText: '确认导入替换',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        setImportModal(false);
        messageApi.success('导入成功，数据已更新');
      },
    });
  };

  const columns: ColumnsType<ErrorCode> = [
    {
      title: '错误码', dataIndex: 'code', key: 'code', width: 90,
      render: v => <span className="font-mono font-medium">{v}</span>,
    },
    {
      title: '枚举名', dataIndex: 'enumName', key: 'enumName', width: 200,
      render: v => <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{v}</span>,
    },
    {
      title: '用户提示（中文）', dataIndex: 'zhTip', key: 'zhTip', width: 240,
    },
    {
      title: '用户提示（英文）', dataIndex: 'enTip', key: 'enTip', ellipsis: true,
      render: v => <span className="text-gray-600 text-xs">{v}</span>,
    },
  ];

  return (
    <>
      {contextHolder}

      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <Button size="small" icon={<PlusOutlined />}
            onClick={() => setDrawerRow({ id: '__new__', category: 'general', ...EMPTY })}>
            新增错误码
          </Button>
          <Button size="small" icon={<UploadOutlined />} onClick={() => setImportModal(true)}>上传 Excel 替换</Button>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleExport}>导出 Excel</Button>
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

      <Modal
        open={importModal}
        onCancel={() => setImportModal(false)}
        title="Excel 解析预览"
        footer={
          <Space>
            <Button onClick={() => setImportModal(false)}>取消</Button>
            <Button type="primary" onClick={handleImportConfirm}>确认导入替换</Button>
          </Space>
        }
        width={500} centered
      >
        <div className="py-3 space-y-4 text-sm">
          <div className="text-gray-500">解析完成，共识别 <span className="font-medium text-gray-900">47 条</span>错误码。</div>

          {/* 新增 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="success">新增</Tag>
              <span className="font-medium text-gray-900">3 条</span>
            </div>
            <div className="bg-green-50 rounded-lg px-3 py-2 space-y-1.5 text-xs text-gray-600">
              {[
                '10006  USER_NOT_ACTIVE',
                '20011  ORDER_PAYMENT_FAILED',
                '23025  DRIVER_UNAVAILABLE',
              ].map((t, i) => <div key={i} className="flex gap-1.5 font-mono"><span className="text-green-500">+</span>{t}</div>)}
            </div>
          </div>

          {/* 删除 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="error">删除</Tag>
              <span className="font-medium text-gray-900">0 条</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-400">无删除项</div>
          </div>

          {/* 修改 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="processing">修改</Tag>
              <span className="font-medium text-gray-900">5 条</span>
            </div>
            <div className="bg-blue-50 rounded-lg px-3 py-2 space-y-1.5 text-xs text-gray-600">
              {[
                '9002  SYSTEM_BUSY → 用户提示（中文）已更新',
                '20001  ORDER_NOT_FOUND → 用户提示（英文）已更新',
                '23001  DRIVER_NO_SHOW → 枚举名已更新',
              ].map((t, i) => <div key={i} className="flex gap-1.5"><span className="text-blue-400">~</span><span className="font-mono">{t}</span></div>)}
              <div className="text-gray-400">…及其他 2 条</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
