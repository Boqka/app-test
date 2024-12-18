import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Typography } from 'antd';

interface Currency {
  CharCode: string;
  Name: string;
  Nominal: number;
  Value: number;
  Previous: number;
}

interface CurrencyResponse {
  Valute: Record<string, Currency>;
}

const { Title } = Typography;

const CurrencyRates: React.FC = () => {
  const [data, setData] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const response = await axios.get<CurrencyResponse>('https://www.cbr-xml-daily.ru/daily_json.js');
        const currencies = Object.values(response.data.Valute);
        setData(currencies);
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyData();
  }, []);

  if (loading) return <Spin size="large" />;
  if (error) return <Title level={4}>{error}</Title>;

  const columns = [
    {
      title: 'Код',
      dataIndex: 'CharCode',
      key: 'CharCode',
    },
    {
      title: 'Название',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Номинал',
      dataIndex: 'Nominal',
      key: 'Nominal',
    },
    {
      title: 'Цена',
      dataIndex: 'Value',
      key: 'Value',
    },
    {
      title: 'Предыдущая цена',
      dataIndex: 'Previous',
      key: 'Previous',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Курсы валют</Title>
      <Table dataSource={data} columns={columns} rowKey="CharCode" />
    </div>
  );
};

export default CurrencyRates;