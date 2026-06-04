'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Button, Modal, Select, Segmented, message,
  Table, Space, Tooltip, ConfigProvider, Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UploadOutlined, DownloadOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { INITIAL_VEHICLE_DATA, INITIAL_VEHICLE_DATA_SANDBOX, type VehicleData } from '../mock-data';

const STORAGE_KEYS = {
  production: 'admin_config_vehicles_flat_production_v2',
  sandbox: 'admin_config_vehicles_flat_sandbox_v2',
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
  enDesc: string;
  zhDesc: string;
  srKey: string;
  srParentName: string;
  srParentNameZh: string;
  srName: string;
  srNameZh: string;
}

function vehicleDataToRows(data: VehicleData): FlatRow[] {
  const rows: FlatRow[] = [];
  let i = 0;
  for (const [market, cities] of Object.entries(data)) {
    for (const [city, vehicles] of Object.entries(cities)) {
      for (const v of vehicles) {
        const base = {
          market, city, serviceType: v.key,
          displayName: v.enName, displayNameZh: v.zhName,
          imageUrl: v.imageUrl,
          enDesc: v.enDesc, zhDesc: v.zhDesc,
        };
        if (v.specialRequests.length === 0) {
          rows.push({ id: `r${i++}`, ...base, srKey: '', srParentName: '', srParentNameZh: '', srName: '', srNameZh: '' });
        } else {
          for (const sr of v.specialRequests) {
            rows.push({ id: `r${i++}`, ...base, srKey: sr.name, srParentName: sr.parent_enName, srParentNameZh: sr.parent_zhName, srName: sr.enName, srNameZh: sr.zhName });
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
      const parsed: FlatRow[] = stored ? JSON.parse(stored) : [];
      if (parsed.length > 0) {
        setRows(parsed);
      } else {
        const initial = vehicleDataToRows(env === 'production' ? INITIAL_VEHICLE_DATA : INITIAL_VEHICLE_DATA_SANDBOX);
        setRows(initial);
        localStorage.setItem(STORAGE_KEYS[env], JSON.stringify(initial));
      }
    } catch {
      setRows(vehicleDataToRows(env === 'production' ? INITIAL_VEHICLE_DATA : INITIAL_VEHICLE_DATA_SANDBOX));
    }
  }, [env]);
  return { rows };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VehiclesPage() {
  const [env, setEnv] = useState<Env>('production');
  const { rows } = useRows(env);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSr, setSelectedSr] = useState('');
  const [importModal, setImportModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const marketOptions = useMemo(() => {
    const vals = [...new Set(rows.map(r => r.market))].sort();
    return [{ label: '全部国家', value: '' }, ...vals.map(v => ({ label: v, value: v }))];
  }, [rows]);

  const cityOptions = useMemo(() => {
    const source = selectedMarket ? rows.filter(r => r.market === selectedMarket) : rows;
    const vals = [...new Set(source.map(r => r.city))].sort();
    return [{ label: '全部城市', value: '' }, ...vals.map(v => ({ label: v, value: v }))];
  }, [rows, selectedMarket]);

  const vehicleOptions = useMemo(() => {
    let source = rows;
    if (selectedMarket) source = source.filter(r => r.market === selectedMarket);
    if (selectedCity) source = source.filter(r => r.city === selectedCity);
    const vals = [...new Set(source.map(r => r.displayNameZh))].sort();
    return [{ label: '全部车型', value: '' }, ...vals.map(v => ({ label: v, value: v }))];
  }, [rows, selectedMarket, selectedCity]);

  const srOptions = useMemo(() => {
    let source = rows;
    if (selectedMarket) source = source.filter(r => r.market === selectedMarket);
    if (selectedCity) source = source.filter(r => r.city === selectedCity);
    if (selectedVehicle) source = source.filter(r => r.displayNameZh === selectedVehicle);
    const vals = [...new Set(source.map(r => r.srNameZh).filter(Boolean))].sort();
    return [{ label: '全部附加服务', value: '' }, ...vals.map(v => ({ label: v, value: v }))];
  }, [rows, selectedMarket, selectedCity, selectedVehicle]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (selectedMarket && r.market !== selectedMarket) return false;
      if (selectedCity && r.city !== selectedCity) return false;
      if (selectedVehicle && r.displayNameZh !== selectedVehicle) return false;
      if (selectedSr && r.srNameZh !== selectedSr) return false;
      return true;
    });
  }, [rows, selectedMarket, selectedCity, selectedVehicle, selectedSr]);

  const handleMarketChange = (v: string) => {
    setSelectedMarket(v);
    setSelectedCity('');
    setSelectedVehicle('');
    setSelectedSr('');
  };

  const handleCityChange = (v: string) => {
    setSelectedCity(v);
    setSelectedVehicle('');
    setSelectedSr('');
  };

  const handleVehicleChange = (v: string) => {
    setSelectedVehicle(v);
    setSelectedSr('');
  };

  const handleExport = () => {
    const data = rows.map(r => ({
      'Market': r.market,
      'City': r.city,
      'API serviceType': r.serviceType,
      '用户展示（英文）': r.displayName,
      '用户展示（中文）': r.displayNameZh,
      '图片链接': r.imageUrl,
      '车型描述（英文）': r.enDesc,
      '车型描述（中文）': r.zhDesc,
      'API specialRequest': r.srKey,
      '附加服务分组标题（英文）': r.srParentName,
      '附加服务分组标题（中文）': r.srParentNameZh,
      '用户展示（英文）_SR': r.srName,
      '用户展示（中文）_SR': r.srNameZh,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '车型数据');
    XLSX.writeFile(wb, `lalamove_${env === 'production' ? '正式环境' : '沙盒环境'}_车型数据.xlsx`);
    messageApi.success('导出成功');
  };

  const handleImportConfirm = () => {
    Modal.confirm({
      title: '确认导入？',
      content: '导入后将覆盖当前配置，此操作不可撤销。',
      okText: '确认导入替换',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        setImportModal(false);
        messageApi.success('导入成功，数据已更新');
      },
    });
  };

  const empty = <span className="text-gray-300">—</span>;
  const mono = (v: string) => v
    ? <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{v}</span>
    : empty;

  const columns: ColumnsType<FlatRow> = [
    { title: '市场（国家）',          dataIndex: 'market',        key: 'market',        width: 110, fixed: 'left' },
    { title: '城市',                dataIndex: 'city',          key: 'city',          width: 120, fixed: 'left' },
    { title: 'API serviceType',     dataIndex: 'serviceType',   key: 'serviceType',   width: 110, render: mono },
    { title: '车型名（英文）',       dataIndex: 'displayName',   key: 'displayName',   width: 150 },
    { title: '车型名（中文）',       dataIndex: 'displayNameZh', key: 'displayNameZh', width: 160 },
    { title: '图片链接',             dataIndex: 'imageUrl',      key: 'imageUrl',      width: 160,
      render: v => v ? (
        <Tooltip title={v}>
          <a href={v} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 underline font-mono line-clamp-2 break-all">{v}</a>
        </Tooltip>
      ) : empty },
    { title: '车型描述（英文）',     dataIndex: 'enDesc',        key: 'enDesc',        width: 180,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
    { title: '车型描述（中文）',     dataIndex: 'zhDesc',        key: 'zhDesc',        width: 150,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
    { title: 'API specialRequest',  dataIndex: 'srKey',         key: 'srKey',         width: 160, render: mono },
    { title: '服务标题（英文）',     dataIndex: 'srParentName',   key: 'srParentName',   width: 160,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
    { title: '服务标题（中文）',     dataIndex: 'srParentNameZh', key: 'srParentNameZh', width: 150,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
    { title: '服务描述（英文）',     dataIndex: 'srName',        key: 'srName',        width: 150,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
    { title: '服务描述（中文）',     dataIndex: 'srNameZh',      key: 'srNameZh',      width: 120,
      render: v => v ? <Tooltip title={v}><span className="line-clamp-2 text-xs cursor-default">{v}</span></Tooltip> : empty },
  ];

  return (
    <>
      {contextHolder}

      <div className="flex items-center justify-between mb-5">
        <ConfigProvider theme={{ components: { Segmented: { itemSelectedColor: '#2257D4' } } }}>
          <Segmented
            value={env}
            onChange={k => { setEnv(k as Env); setSelectedMarket(''); setSelectedCity(''); setSelectedVehicle(''); setSelectedSr(''); }}
            options={[{ value: 'production', label: '正式环境' }, { value: 'sandbox', label: '沙盒环境' }]}
          />
        </ConfigProvider>
        <div className="flex items-center gap-2">
          <Button size="small" icon={<UploadOutlined />} onClick={() => setImportModal(true)}>上传 Excel 替换</Button>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleExport}>导出 Excel</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Select
          value={selectedMarket}
          onChange={handleMarketChange}
          options={marketOptions}
          style={{ width: 150 }}
          size="small"
        />
        <Select
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          style={{ width: 150 }}
          size="small"
        />
        <Select
          value={selectedVehicle}
          onChange={handleVehicleChange}
          options={vehicleOptions}
          showSearch
          optionFilterProp="label"
          style={{ width: 230 }}
          size="small"
        />
        <Select
          value={selectedSr}
          onChange={setSelectedSr}
          options={srOptions}
          showSearch
          optionFilterProp="label"
          style={{ width: 230 }}
          size="small"
        />
        <Button
          size="small"
          onClick={() => { setSelectedMarket(''); setSelectedCity(''); setSelectedVehicle(''); setSelectedSr(''); }}
        >
          重置
        </Button>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: 2100 }}
        pagination={{ pageSize: 50, showTotal: t => `共 ${t} 行`, hideOnSinglePage: true }}
      />

      <Modal
        open={importModal}
        onCancel={() => setImportModal(false)}
        title={`Excel 解析预览（${env === 'production' ? '正式环境' : '沙盒环境'}）`}
        footer={
          <Space>
            <Button onClick={() => setImportModal(false)}>取消</Button>
            <Button type="primary" onClick={handleImportConfirm}>确认导入替换</Button>
          </Space>
        }
        width={520} centered
      >
        <div className="py-3 space-y-4 text-sm">
          <div className="text-gray-500">解析完成，共识别 <span className="font-medium text-gray-900">3,412 行</span>数据，涉及 4 个市场、18 个城市。</div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="success">新增</Tag>
              <span className="font-medium text-gray-900">8 行</span>
            </div>
            <div className="bg-green-50 rounded-lg px-3 py-2 space-y-1.5 text-xs text-gray-600">
              {[
                'Indonesia / Jakarta / MOTORCYCLE → 新增车型',
                'Malaysia / Penang / VAN_500 → 新增城市车型',
                'Thailand / Phuket / SEDAN → 新增城市车型',
              ].map((t, i) => <div key={i} className="flex gap-1.5"><span className="text-green-500">+</span>{t}</div>)}
              <div className="text-gray-400">…及其他 5 行</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="error">删除</Tag>
              <span className="font-medium text-gray-900">3 行</span>
            </div>
            <div className="bg-red-50 rounded-lg px-3 py-2 space-y-1.5 text-xs text-gray-600">
              {[
                'Indonesia / Medan / TRUCK_330_EP',
                'Thailand / Chiang Mai / PICKUP',
                'Vietnam / Da Nang / MINIVAN',
              ].map((t, i) => <div key={i} className="flex gap-1.5"><span className="text-red-400">−</span>{t}</div>)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="processing">修改</Tag>
              <span className="font-medium text-gray-900">12 行</span>
            </div>
            <div className="bg-blue-50 rounded-lg px-3 py-2 space-y-1.5 text-xs text-gray-600">
              {[
                'Indonesia / Jakarta / SEDAN → 用户展示（英文）: "Sedan" → "Standard Sedan"',
                'Malaysia / KL / SUV_600 → 图片链接已更新',
                'Vietnam / HCM / TRUCK_1000 → 附加服务描述已更新',
              ].map((t, i) => <div key={i} className="flex gap-1.5"><span className="text-blue-400">~</span>{t}</div>)}
              <div className="text-gray-400">…及其他 9 行</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
