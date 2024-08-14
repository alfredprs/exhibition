"use client"
import Image from "next/image";
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import LineChart from "./LineChart";
import PaginatedTable from "./PaginatedTable";
import SimpleChart from "./SimpleChart";

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
  const [dataAll, setDataAll] = useState([]);
  const [dataHarian, setDataHarian] = useState([]);
  const [dataSatuMinggu, setDataSatuMinggu] = useState([]);
  const [dataDuaMinggu, setDataDuaMinggu] = useState([]);
  const [location, setLocation] = useState('');
  const [dataStatistik, setDataStatistik] = useState([]);
  const [cardMingguan, setCardMingguan] = useState([]);
  const [dataBeratDuaMinggu, setDataBeratDuaMinggu] = useState([]);
  const [cardBerat, setCardBerat] = useState([]);
  const [totalBerat, setTotalBerat] = useState(null);

  const fetchDataAll = async () => {
    try {
      if (location && location !== '') {
        const response = await fetch(`/api/dataSemua?location=${location}`);
        const jsonData = await response.json();
        setDataAll(jsonData);
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };
  
  const fetchTotalBerat = async () => {
    try {
      if (location && location !== '') {
        const response = await fetch(`/api/dataTotalBerat?location=${location}`);
        const jsonData = await response.json();
        setTotalBerat(jsonData[0]['total'])
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const fetchDataHarian = async () => {
    try {
      if (location && location !== '') {
        const response = await fetch(`/api/dataSatuan?location=${location}`);
        const jsonData = await response.json();
        setDataHarian(jsonData);

        const gasData = calculateGasHarian(jsonData);
        const karbonEmisiCalculate = calculateKarbonEmisi(totalBerat);
        
        const dataItems = [
          {title: "Total Gas Dihasilkan", content: `${parseFloat((gasData.today.gasProd).toFixed(2)).toString()} m<sup>3</sup>`, img: "/gas dihasilkan.png", increase: gasData.today.gasProd >= gasData.yesterday.gasProd ? true : false, value: `${parseFloat((Math.abs(gasData.today.gasProd - gasData.yesterday.gasProd)).toFixed(2)).toString()} m<sup>3</sup>`, percentage: calculatePercentage(gasData.today.gasProd, gasData.yesterday.gasProd) },
          {title: "Total Gas Terpakai", content:`${parseFloat((gasData.today.gasUsed).toFixed(2)).toString()} m<sup>3</sup>`, img: "/gas terpakai.png", increase: gasData.today.gasUsed >= gasData.yesterday.gasUsed ? true : false, value: `${parseFloat((Math.abs(gasData.today.gasUsed - gasData.yesterday.gasUsed)).toFixed(2)).toString()} m<sup>3</sup>`, percentage: calculatePercentage(gasData.today.gasUsed, gasData.yesterday.gasUsed) },
          {title: "Banyak Sampah Diproses", content: `${parseFloat((gasData.today.weight).toFixed(2)).toString()} Kg`, img: "/sampah diproses.png", increase: gasData.today.weight >= gasData.yesterday.weight ? true : false, value: `${parseFloat((Math.abs(gasData.today.weight - gasData.yesterday.weight)).toFixed(2)).toString()} Kg`, percentage: calculatePercentage(gasData.today.weight, gasData.yesterday.weight)},
          {title: "Emisi Karbon Dioksida yang Telah Diserap", content: `${karbonEmisiCalculate} ton CO2e/tahun`, img: "/karbon emisi.png" }
        ];
        setDataStatistik(dataItems);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataSatuMinggu = async () => {
    try {
      if (location && location !== '') {
        const response = await fetch(`/api/dataSatuMinggu?location=${location}`);
        const jsonData = await response.json();
        setDataSatuMinggu(jsonData);
      }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const fetchDataDuaMinggu = async () => {
    try {
      if (location && location !== '') {
        const response = await fetch(`/api/dataDuaMinggu?location=${location}`);
        const jsonData = await response.json();
        setDataDuaMinggu(jsonData);

        const gasData = calculateGasHarian(jsonData);
        const dataItems = [
          {title: "Gas Dihasilkan", content: parseFloat((gasData.today.gasProd).toFixed(2)).toString(), increase: gasData.today.gasProd >= gasData.yesterday.gasProd ? true : false, percentage: calculatePercentage(gasData.today.gasProd, gasData.yesterday.gasProd) },
          {title: "Gas Terpakai", content: parseFloat((gasData.today.gasUsed).toFixed(2)).toString(), increase: gasData.today.gasUsed >= gasData.yesterday.gasUsed ? true : false, percentage: calculatePercentage(gasData.today.gasUsed, gasData.yesterday.gasUsed) }
        ];
        setCardMingguan(dataItems);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchDataBeratDuaMinggu = async () => {
    try {
      const response = await fetch(`/api/dataBeratDuaMinggu`);
      const jsonData = await response.json();
      setDataBeratDuaMinggu(jsonData);

      const weightDataJatisari= calculateWeightWeekly(jsonData["Jatisari"]);
      const weightDataKLHK = calculateWeightWeekly(jsonData["KLHK"]);
      const weightDataPondokRangon = calculateWeightWeekly(jsonData["Pondok Rangon"]);
      
      const dataItems = [
        {title: "Taman Jatisari", content: parseFloat((weightDataJatisari.thisWeek.weight).toFixed(2)).toString(), increase: weightDataJatisari.thisWeek.weight >= weightDataJatisari.lastWeek.weight ? true : false, percentage: calculatePercentage(weightDataJatisari.thisWeek.weight, weightDataJatisari.lastWeek.weight), value: parseFloat((Math.abs(weightDataJatisari.thisWeek.weight - weightDataJatisari.lastWeek.weight)).toFixed(2)).toString() },
        {title: "KLHK", content: parseFloat((weightDataKLHK.thisWeek.weight).toFixed(2)).toString(), increase: weightDataKLHK.thisWeek.weight >= weightDataKLHK.lastWeek.weight ? true : false, percentage: calculatePercentage(weightDataKLHK.thisWeek.weight, weightDataKLHK.lastWeek.weight), value: parseFloat((Math.abs(weightDataKLHK.thisWeek.weight - weightDataKLHK.lastWeek.weight)).toFixed(2)).toString() },
        {title: "Pondok Rangon", content: parseFloat((weightDataPondokRangon.thisWeek.weight).toFixed(2)).toString(), increase: weightDataPondokRangon.thisWeek.weight >= weightDataPondokRangon.lastWeek.weight ? true : false, percentage: calculatePercentage(weightDataPondokRangon.thisWeek.weight, weightDataPondokRangon.lastWeek.weight), value: parseFloat((Math.abs(weightDataPondokRangon.thisWeek.weight - weightDataPondokRangon.lastWeek.weight)).toFixed(2)).toString() }
      ];

      setCardBerat(dataItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function calculateKarbonEmisi(volume) {
    const R = 0.082;
    const T = 300;
    const P = 1;

    const n = (P * volume * 1000) / (R * T);

    const molAkhir = n * (66.4/100);

    const massaAkhir = molAkhir * 16;

    const massaCO2 = (massaAkhir * 28 * 3 ) / 1000000;

    return parseFloat(massaCO2).toFixed(2);
  }

  function calculateGasHarian(data) {
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' };
  
    const today = new Date().toLocaleDateString('en-CA', options);
    const yesterday = new Date(Date.now() - 864e5).toLocaleDateString('en-CA', options);
  
    let latestTodayEntry = null;
    let latestYesterdayEntry = null;
    
    let earliestTodayEntry = null;
    let earliestYesterdayEntry = null;

    data.forEach(item => {
      const dateCreated = item.date_created.split('T')[0];
      const hourCreated = item.date_created.split('T')[1].split(':')[0];
      
      if (dateCreated === today) {
        if (!latestTodayEntry || hourCreated > latestTodayEntry.date_created.split('T')[1].split(':')[0]) {
          latestTodayEntry = item;
        }
        if (!earliestTodayEntry || hourCreated < earliestTodayEntry.date_created.split('T')[1].split(':')[0]) {
          earliestTodayEntry = item;
        }
      } else if (dateCreated === yesterday) {
        if (!latestYesterdayEntry || hourCreated > latestYesterdayEntry.date_created.split('T')[1].split(':')[0]) {
          latestYesterdayEntry = item;
        }
        if (!earliestYesterdayEntry || hourCreated < earliestYesterdayEntry.date_created.split('T')[1].split(':')[0]) {
          earliestYesterdayEntry = item;
        }
      }
    });
  
    return {
      today: latestTodayEntry ? { gasProd: Math.abs(latestTodayEntry.gas_prod - earliestTodayEntry.gas_prod), gasUsed: Math.abs(latestTodayEntry.gas_used - earliestTodayEntry.gas_used), weight: Math.abs(latestTodayEntry.weight - latestTodayEntry.weight) } : { gasProd: 0, gasUsed: 0, weight: 0 },
      yesterday: latestYesterdayEntry ? { gasProd: Math.abs(latestYesterdayEntry.gas_prod - earliestYesterdayEntry.gas_prod), gasUsed: Math.abs(latestYesterdayEntry.gas_used - earliestYesterdayEntry.gas_used), weight: Math.abs(latestYesterdayEntry.weight - - earliestYesterdayEntry.weight) } : { gasProd: 0, gasUsed: 0, weight: 0 }
    };
  }

  function calculateGasWeekly(data) {
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' };
  
    const today = new Date().toLocaleDateString('en-CA', options);
    const sevenDaysAgo = new Date(Date.now() - 6 * 864e5).toLocaleDateString('en-CA', options);
  
    let earliestEntry = null;
    let latestEntry = null;
  
    data.forEach(item => {
      const dateCreated = item.date_created.split('T')[0];
      const hourCreated = item.date_created.split('T')[1].split(':')[0];
  
      if (dateCreated >= sevenDaysAgo && dateCreated <= today) {
        if (!earliestEntry || dateCreated < earliestEntry.date_created.split('T')[0] || (dateCreated === earliestEntry.date_created.split('T')[0] && hourCreated < earliestEntry.date_created.split('T')[1].split(':')[0])) {
          earliestEntry = item;
        }
        if (!latestEntry || dateCreated > latestEntry.date_created.split('T')[0] || (dateCreated === latestEntry.date_created.split('T')[0] && hourCreated > latestEntry.date_created.split('T')[1].split(':')[0])) {
          latestEntry = item;
        }
      }
    });
  
    return {
      firstDay: earliestEntry ? { gasProd: Math.abs(earliestEntry.gas_prod), gasUsed: Math.abs(earliestEntry.gas_used) } : { gasProd: 0, gasUsed: 0 },
      lastDay: latestEntry ? { gasProd: Math.abs(latestEntry.gas_prod), gasUsed: Math.abs(latestEntry.gas_used) } : { gasProd: 0, gasUsed: 0 }
    };
  }
  

  function calculateWeightWeekly(data) {
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' };

    const today = new Date().toLocaleDateString('en-CA', options);
    const sevenDaysAgo = new Date(Date.now() - 6 * 864e5).toLocaleDateString('en-CA', options);

    let weightThisWeek = 0;
    let weightLastWeek = 0;
  
    data.forEach(item => {
      const dateCreated = item.date_created.split('T')[0];

      if (dateCreated >= sevenDaysAgo && dateCreated <= today) {
        if (dateCreated >= sevenDaysAgo) {
          weightThisWeek += Math.abs(item.weight);
        } else {
          weightLastWeek += Math.abs(item.weight);
        }
      }
    });

    return {
      thisWeek: { weight: weightThisWeek },
      lastWeek: { weight: weightLastWeek }
    };
  }

  function calculatePercentage(after, before) {
    if (before === 0) {
        if (after === 0) {
            return 0;
        } else {
            return 100;
        }
    }
    
    return parseFloat(((Math.abs(after - before) / before) * 100).toFixed(2)).toString();
  }
  
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
      setLocation(window.localStorage.getItem('location'));
    } else {
      setLocation('pasar_koja_jakut');
      window.localStorage.setItem('location', 'pasar_koja_jakut')
    }
    
    fetchDataAll();
    fetchTotalBerat()
    .catch(error => console.error('Error fetching statistics:', error));
    fetchDataSatuMinggu()
    .catch(error => console.error('Error fetching statistics:', error));
    fetchDataDuaMinggu()
    .catch(error => console.error('Error fetching statistics:', error));
    fetchDataBeratDuaMinggu()
    .catch(error => console.error('Error fetching statistics:', error));
    // fetchDataHarian()
    // .catch(error => console.error('Error fetching statistics:', error));
    scrollToTop();
  }, [location])

  useEffect(() => {
    if (totalBerat !== null) {
      fetchDataHarian()
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [totalBerat]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleLocationChange = (event) => {
    if (event.target.value === 'pasar_koja') {
      setLocation('pasar_koja_jakut');
      window.localStorage.setItem('location', 'pasar_koja_jakut');
    } else {
      setLocation(event.target.value);
     window.localStorage.setItem('location', event.target.value);
    }
  };

  return (
    <main className="flex min-h-screen min-w-full flex-col bg-white text-black">
      <div className="md:container min-w-full sticky top-0 z-10 bg-white sticky top-0 z-20 bg-white"> {/* Make floating */}
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
      <div className="md:container min-w-full relative sticky top-0 z-10 bg-white">
        <div className="flex ml-6 mt-40">
          <h2 className="welcome text-2xl font-bold">Welcome to Rizqi Semesta</h2>
        </div>
        <div className="flex flex-col ml-6 mb-2">
          <h3 className="data-update font-semibold">Data Update: <ReactLiveClock format="YYYY-MM-DD HH:mm:ss" ticking timezone={'Asia/Jakarta'} suppressHydrationWarning /></h3>
          <h3 className="lokasi-sekarang font-semibold">Lokasi Sekarang: {location === 'pondok_rangon' ? 'Pondok Rangon' : (location === 'taman_jatisari' ? 'Taman Jatisari' : 'KLHK')}</h3>
        </div>
        <div className="ribbon absolute bottom-0 right-0 w-32 h-32 md:w-1/2 md:h-1/3 lg:w-1/2 lg:h-1/3 xl:w-1/2 xl:h-1/3">
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
      <div className="m-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cardBerat.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => handleLocationChange({ target: { value: item.title.toLowerCase().replace(/\s/g, '_') } })}
                className={`w-full h-full text-left`}
              >
                <div className={`p-4 rounded-3xl shadow-2xl border ${location === item.title.toLowerCase().replace(/\s/g, '_') ? 'bg-blue-200 border-black' :  'border-gray-300' }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="font-bold italic text-orange-500 text-sm md:text-lg">Weekly Weight: {item.content} Kg</p>
                    </div>
                    <div style={{width:"40%"}}>
                      <SimpleChart data={dataBeratDuaMinggu} type={item.title}/>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="m-6">
        <div className="p-4 rounded-3xl shadow-2xl border border-gray-300">
          <div className="px-6 pt-4 pb-2">
            <div className="font-bold text-3xl mb-2">
              <span className="text-orange-500">Data Realtime Produ</span>
              <span style={{ color: "#0095C7" }}>ksi Gas Methane</span>
            </div>
            <p className="font-bold text-sm">Pengukuran Gas secara realtime menggunakan teknologi canggih</p>
            <p className="font-bold text-sm">untuk memonitor pergerakan gas, kualitas air, Suhu Cairan</p>
          </div>
          <div className="px-6 py-4 flex justify-center">
            <Image
              src="/alur capture.png"
              alt="Alur Capture"
              className="items-center object-cover object-center"
              priority
              width={800}
              height={800}
              quality={100}
            />
          </div>
        </div>
      </div>
      <p className="mx-4 mt-2 p"><sup>*Data di bawah merupakan perbandingan antara data hari ini dan kemarin</sup></p>
      <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataStatistik.map((item, index) => (
          <div key={index} className="relative">
            <div className="p-4  rounded-3xl shadow-2xl border border-gray-300">
              <div className="absolute top-3 right-3" style={{ marginLeft: '1.5rem'}}>
                <Image
                  src={item.img}
                  alt="Card Image"
                  width={40}
                  height={40}
                  priority
                  quality={100}
                  
                />
              </div>
              <h4 className="font-bold text-lg w-4/5">{item.title}</h4>
              <p className="font-bold italic text-orange-500 text-xl" dangerouslySetInnerHTML={{ __html: item.content }}></p>
              {item.title !== "Emisi Karbon Dioksida yang Telah Diserap" &&
                <div className="mt-4">
                    <FontAwesomeIcon icon={faSquareArrowUpRight} className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                    <span className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500'}`}> {item.percentage}%</span>
                    <span className="text-gray-500 text-sm"> {item.increase ? 'Meningkat sebanyak ' : 'Menurun sebanyak '}</span>
                    <span className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: item.value }}></span>
                </div>
              }
            </div>
          </div>
        ))}
      </div>
      <div className="m-4 md:m-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {cardMingguan.map((item, index) => (
          <div key={index} className="relative">
            <div className="p-4 rounded-3xl shadow-2xl border border-gray-300">
              <div className="absolute top-4 right-4">
                <span className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500'}`}> {item.percentage}% </span>
                <FontAwesomeIcon icon={faSquareArrowUpRight} className={`text-lg ${item.increase ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
              </div>
              <div className={`absolute top-11 right-4 font-light ${item.title === "Gas Dihasilkan" ? 'text-orange-500' : 'text-blue-500' }`}>
                <p>VS YESTERDAY</p>
              </div> 
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className={`font-bold ${item.title === "Gas Dihasilkan" ? 'text-orange-500' : 'text-blue-500' } text-xl`}>{item.content}</p>
              <hr className="my-4 border-b-2 border-gray-200" />
              <div className="mt-4">
                <LineChart data={dataHarian} type={item.title}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PaginatedTable dataAll={dataAll} location={location} />
      <footer className="py-8">
        <div className="footer container mx-auto flex flex-wrap md:flex-no-wrap justify-between">
          <div className="w-full md:w-auto mb-4 md:mb-0 ">
            <h4 className="font-bold mb-2">Contact Us</h4>
            <p>PT. Rizqi Semesta</p>
            <a href="https://api.whatsapp.com/send/?phone=6281806819999&text&type=phone_number&app_absent=0" className="text-blue-500">
              <p>0818 0681 9999</p>
            </a>
            <p><a href="http://www.rizqisemesta.com" className="text-blue-500">www.rizqisemesta.com</a></p>
          </div>
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h4 className="font-bold mb-2">About Us</h4>
            <ul>
              <li><a href="#" className="text-blue-500">Home</a></li>
              <li><a href="#" className="text-blue-500">Services</a></li>
              <li><a href="#" className="text-blue-500">About</a></li>
              <li><a href="#" className="text-blue-500">Pricing</a></li>
            </ul>
          </div>
          <div className="w-full md:w-auto">
            <h4 className="font-bold mb-2">About Our Company</h4>
            <div className="text-center md:text-left mb-2">
              <Image
                src="/rmc logo.png"
                alt="Logo RMC"
                className="mx-auto md:mx-0"
                width={100}
                height={80}
                priority
                quality={100}
              />
            </div>
            <span className="inline-block max-w-sm">
              RMC adalah produk dari PT Rizqi Semesta yang beroperasi khusus di bidang pengolahan limbah organik.
            </span>
            {/* <h6>RMC adalah produk dari PT Rizqi Semesta yang beroperasi khusus di bidang pengolahan limbah organik.</h6> */}
          </div>
        </div>
        <div className="container mx-auto text-center mt-8">
          <p className="text-gray-600">Copyright © 2024 Rizqi Semesta. All Rights Reserved.</p>
        </div>
    </footer>
    </main>
  );
}
