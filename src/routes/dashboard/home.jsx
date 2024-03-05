import { useEffect, useState } from 'react';
import { getCall } from '@/lib/api';

export default function HomeUser() {

    const [data, setData] = useState([]);

    useEffect(() => {
        getCall('/api/test/user').then((res) => {
            setData(res.data);
        });
      }, []);

  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container flex flex-col items-center justify-center space-y-4 px-4 md:px-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Hola {data.user}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {data.message}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}