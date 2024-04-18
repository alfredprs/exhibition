"use client"
import Image from "next/image";
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

const ReactLiveClock = dynamic(() => import('react-live-clock'), { ssr: false });

const dayList = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function rotateDayList(dayList) {
  const today = new Date().getDay();
  
  const rotatedDayList = [
    ...dayList.slice(today), 
    ...dayList.slice(0, today) 
  ];
  
  if (typeof window != "undefined") {
    window.localStorage.setItem('rotatedDayList', JSON.stringify(rotatedDayList));
    window.localStorage.setItem('rotationDate', new Date().toLocaleDateString());
  }

  return rotatedDayList;
}

function checkRotation() {
  const storedDate = typeof window != "undefined" ? window.localStorage.getItem('rotationDate') : '';
  const currentDate = new Date().toLocaleDateString();

  if (storedDate !== currentDate) {
    const rotatedList = rotateDayList(dayList);
    return rotatedList;
  }
}


export default function Home() {
  const [rotatedDayList, setRotatedDayList] = useState([]);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState('pasar_koja_jakut');

  const fetchDataAll = async () => {
    try {
        const response = await fetch(`/api/dataSemua?location=${location}`);
        const jsonData = await response.json();
        setData(jsonData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const rotatedList = checkRotation();
    if (rotatedList) {
      setRotatedDayList(rotatedList);
    } else {
      const storedRotatedDayList = JSON.parse(window.localStorage.getItem('rotatedDayList'));
      if (storedRotatedDayList) {
        setRotatedDayList(storedRotatedDayList);
      }
    }

    if (window.localStorage.getItem('location')) {
      setLocation(window.localStorage.getItem('location'))
    }
    fetchDataAll();
  }, [location])

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    window.localStorage.setItem('location', event.target.value);
  };

  const gasDihasilkanChart = () => {
    const data = {
      
    }
  };
  return (
    <main className="flex min-h-screen min-w-full flex-col bg-white text-black">
      <div className="md:container min-w-full"> {/* Make floating */}
        <div className="rmc-logo absolute ml-6 mt-6">
        <Image
              src="/rmc logo.png"
              alt="Logo RMC"
              className=""
              width={219}
              height={80}
              priority
              quality={100}
            />
        </div>
        <div className="company-logo absolute mr-6 mt-5 right-0 top-0">
        <Image
              src="/dna logo.png"
              alt="Logo Perusahaan"
              className=""
              width={100}
              height={139}
              priority
              quality={100}
            />
        </div>
      </div>
      <div className="md:container min-w-full relative">
        <div className="flex ml-6 mt-40">
          <h2 className="welcome text-2xl font-bold">Welcome to Rizqi Semesta</h2>
        </div>
        <div className="flex ml-6">
          <h3 className="data-update font-semibold">Data Update: <ReactLiveClock format="YYYY-MM-DD HH:mm:ss" ticking timezone={'Asia/Jakarta'} suppressHydrationWarning /></h3>
        </div>
        <div className="ribbon absolute bottom-0 right-0 w-32 h-32 md:w-1/2 md:h-1/4 lg:w-1/2 lg:h-1/4 xl:w-1/2 xl:h-1/4">
          <Image
            src="/ribbon.jpg"
            alt="Ribbon"
            className="object-cover object-center"
            priority
            quality={100}
            fill={true}
          />
        </div>
      </div>
      <div className="m-4">
        <div className="p-4 rounded border border-gray-300">
          <div className="px-6 pt-4 pb-2">
            <div className="font-bold text-3xl mb-2">
              <span className="text-orange-500">Data Realtime Produ</span>
              <span className="text-blue-600">ksi Gas Methane</span>
            </div>
            <p className="font-bold text-sm">Pengukuran Gas secara realtime menggunakan teknologi canggih</p>
            <p className="font-bold text-sm">untuk memonitor pergerakan gas, kualitas air, Suhu Cairan</p>
          </div>
          <div className="px-6 py-4">
            <img className="w-full" src="/alur capture.png" alt="Card" />
          </div>
        </div>
      </div>
      <div className="mx-4 flex items-center">
        <span className="mr-2">Pilih Lokasi:</span>
        <select
            value={location}
            onChange={handleLocationChange}
            className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
            <option value="pasar_koja_jakut">Pasar Koja Jakut</option>
            <option value="taman_jatisari">Taman Jatisari</option>
        </select>
      </div>
      <p className="mx-4 mt-2 p"><sup>*Data di bawah merupakan perbandingan antara data hari ini dan kemarin</sup></p>
      <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Gas Dihasilkan", content: "21.25", img: "/gas dihasilkan.png", increase: false, value: "7", percentage:"5" },
          { title: "Total Gas Terpakai", content: "21.25", img: "/gas terpakai.png", increase: true, value:"6", percentage:"8"  },
          { title: "Banyak Sampah Diproses", content: "21.25", img: "/sampah diproses.png", increase: false, value:"2", percentage:"1,6"  },
          { title: "Karbon Emisi yang Berkurang", content: "21.25", img: "/karbon emisi.png", increase: true, value:"8", percentage:"9,3"  },
        ].map((item, index) => (
          <div key={index} className="relative">
            <div className="p-4  rounded border border-gray-300">
              <div className="absolute top-3 right-3">
                <Image
                  src={item.img}
                  alt="Card Image"
                  width={40}
                  height={40}
                  priority
                  quality={100}
                />
              </div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="font-bold italic text-orange-500 text-xl">{item.content} m<sup>3</sup></p>
              <div className="mt-4">
                  <FontAwesomeIcon icon={faSquareArrowUpRight} className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                  <span className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500'}`}> {item.percentage}%</span>
                  <span className="text-gray-500 text-sm"> {item.increase ? 'Meningkat' : 'Menurun'} sebanyak {item.value} m<sup>3</sup></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="m-4 md:m-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {[
          { title: "Gas Dihasilkan", content: "6,345", increase:false, percentage: "1.3" },
          { title: "Gas Terpakai", content: "6,345", increase:true, percentage: "1.3" },
        ].map((item, index) => (
          <div key={index} className="relative">
            <div className="p-4 rounded border border-gray-300">
              <div className="absolute top-4 right-4">
                <span className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500'}`}> {item.percentage}% </span>
                <FontAwesomeIcon icon={faSquareArrowUpRight} className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
              </div>
              <div className="absolute top-11 right-4 font-light text-orange-500">
                <p>VS LAST WEEK</p>
              </div> 
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="font-bold text-orange-500 text-xl">{item.content}</p>
              <hr className="my-4 border-b-2 border-gray-200" />
              <div className="mt-4">
                {data.length}
                {/* Insert chart here */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
