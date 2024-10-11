'use client';

import { useEffect, useState } from 'react';

const ipAddresses = [
  '192.168.20.100',
  '192.168.20.101',
  '192.168.20.102',
  '192.168.20.103',
  '192.168.20.104',
  '192.168.20.105',
  '192.168.20.106',
  '192.168.20.107',
  // 他のIPアドレスを追加
];

export default function Home() {
  const [pingResults, setPingResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchPingData = () => {
      ipAddresses.forEach(ip => {
        fetch(`/api/ping?ip=${ip}`)
          .then(res => res.json())
          .then(data => {
            setPingResults(prev => ({ ...prev, [ip]: data }));
          })
          .catch(() => {
            setPingResults(prev => ({ ...prev, [ip]: { status: 'unreachable' } }));
          });
      });
    };

    // 5秒ごとにpingの結果を取得
    fetchPingData();
    const interval = setInterval(fetchPingData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Ping Monitor</h1>
      <div>
        {ipAddresses.map(ip => (
          <div key={ip}>
            {ip}: {pingResults[ip] ? `${pingResults[ip].status} (${pingResults[ip].time || 'N/A'} ms)` : '計測中...'}
          </div>
        ))}
      </div>
    </div>
  );
}
