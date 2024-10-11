import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get('ip');

  if (!ip) {
    return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
  }

  return new Promise((resolve) => {
    exec(`ping -c 1 ${ip}`, (error, stdout) => {
      if (error) {
        resolve(NextResponse.json({ ip, status: 'unreachable' }, { status: 500 }));
      } else {
        const timeMatch = stdout.match(/time=(\d+(\.\d+)?) ms/);
        const time = timeMatch ? parseFloat(timeMatch[1]) : null;
        resolve(NextResponse.json({ ip, status: 'reachable', time }));
      }
    });
  });
}
