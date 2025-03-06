import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { notification, Spin, Modal } from "antd"; 
import { LoadingOutlined, EyeOutlined } from '@ant-design/icons'; 
import { HandleSignUp } from "../hooks/HandleSignUp"; 
import { useNavigate } from 'react-router-dom';
import { useFetchProvinsi, useFetchKabupaten, useFetchKecamatan } from "../hooks/HandleSignUp";
import { Link } from "react-router-dom";
// import dayjs from "dayjs";
// import TimePickerElement from "../atoms/TimePickerElement";
import { useDropzone } from "react-dropzone";
import SearchableSelect from "../atoms/SearchAbleSelectElement";

const appName = import.meta.env.VITE_APP_NAME;
const GOOGLE_MAPS_API_KEY = import.meta.env.GOOGLE_API_KEY;

const SignUpForm: FC = () => {
  const [signUpError, setsignUpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKategori] = useState<string>('');
  const [selectedIndex] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); 
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('0');
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('0');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('0');
  const [wilProvinsi, setWilProvinsi] = useState<string>('');
  const [wilKabupaten, setWilKabupaten] = useState<string>('');
  const [wilKecamatan, setWilKecamatan] = useState<string>('');
  const [alamatJalanTempat, setalamatJalanTempat] = useState<string>('');
  const [alamatTimer, setAlamatTimer] = useState<NodeJS.Timeout | null>(null); 
  const [provinsiSearchTerm, setprovinsiSearchTerm] = useState('');
  const [kabupatenSearchTerm, setkabupatenSearchTerm] = useState('');
  const [kecamatanSearchTerm, setkecamatanSearchTerm] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState<string>('');
  const [provinsi_id, set_provinsi_id] = useState<string>('');
  const [kabupaten_id, set_kabupaten_id] = useState<string>('');
  //const { kategori } = useFetchKategori();
  const { provinsi } = useFetchProvinsi(provinsiSearchTerm);
  const { kabupaten } = useFetchKabupaten(provinsi_id, kabupatenSearchTerm);
  const { kecamatan } = useFetchKecamatan(kabupaten_id, kecamatanSearchTerm);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  
  // if (map) {
  //   console.log('Map object:', map);
  // }
  // if (marker) {
  //   console.log('Marker object:', marker);
  // }

  // State for the confirmation modal
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleProvinsiSearchChange = (newprovinsiSearchTerm: string) => {
    setprovinsiSearchTerm(newprovinsiSearchTerm);
  };

  const handleKabupatenSearchChange = (newkabupatenSearchTerm: string) => {
    setkabupatenSearchTerm(newkabupatenSearchTerm); 
  };

  const handleKecamatanSearchChange = (newkecamatanSearchTerm: string) => {
    setkecamatanSearchTerm(newkecamatanSearchTerm); 
  };

  const handleProvinsiChange = (selectedOption: { value: string; label: string }) => {
    const provinsiID = selectedOption.value;
    const wilProvinsi = selectedOption.label;
    setSelectedProvinsi(provinsiID);
    set_provinsi_id(provinsiID);
    setWilProvinsi(wilProvinsi);
    setSelectedKabupaten('0');
    set_kabupaten_id('0');
    setWilKabupaten('Klik Disini');
    setSelectedKecamatan('0');
    setWilKecamatan('Klik Disini');
    setkecamatanSearchTerm('Dummy');
    updateAlamatLengkap();
  };

  const handleKabupatenChange = (selectedOption: { value: string; label: string }) => {
    const kabupatenID = selectedOption.value;
    const wilKabupaten = selectedOption.label;
    setSelectedKabupaten(kabupatenID);
    set_kabupaten_id(kabupatenID);
    setWilKabupaten(wilKabupaten);
    setSelectedKecamatan('0');
    if(kabupatenID != '0'){
      setWilKecamatan('Klik Disini');
      setkecamatanSearchTerm(''); 
    }
    updateAlamatLengkap();
  };

  const handleKecamatanChange = (selectedOption: { value: string; label: string }) => {
    const kecamatanID = selectedOption.value;
    const wilKecamatan = selectedOption.label;
    setSelectedKecamatan(kecamatanID);
    setWilKecamatan(wilKecamatan);
    updateAlamatLengkap();
  };

  useEffect(() => {
    updateAlamatLengkap();
  }, [alamatJalanTempat]);

  const updateAlamatLengkap = () => {
    if (alamatJalanTempat && (wilKecamatan != '' && wilKecamatan != 'Klik Disini') && (wilKabupaten != '' && wilKabupaten != 'Klik Disini') && (wilProvinsi != '' && wilProvinsi != 'Klik Disini')) {
      const alamat = `${alamatJalanTempat} ${wilKecamatan} ${wilKabupaten} ${wilProvinsi}`;
      setAlamatLengkap(alamat);
    }
  };

  useEffect(() => {
    if (alamatLengkap && window.google) {
      const geocoder = new google.maps.Geocoder();
  
      geocoder.geocode({ address: alamatLengkap }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const coords = results[0].geometry.location;
          const lat = coords.lat();
          const lng = coords.lng();
  
          if (map && marker) {
            map.setCenter(coords);
            marker.setPosition(coords);
            setBankSampahData((prevData) => ({
              ...prevData,
              koordinat_lokasi: `${lat},${lng}`,
            }));
          }
        } else {
          notification.error({
            message: "Alamat tidak ditemukan",
            description: `Geocoding gagal untuk alamat: ${alamatLengkap}`,
          });
        }
      });
    }
  }, [alamatLengkap, map, marker]);
  

  const provinsiOptions = [
    { value: '0', label: 'Klik Disini' }, // Default option
      ...provinsi.map((item) => ({
      value: item.id,
      label: item.name.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '), 
    })),
  ];

  const kabupatenOptions = [
    { value: '0', label: 'Klik Disini' }, // Default option
      ...kabupaten.map((item) => ({
      value: item.id,
      label: item.name.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    })),
  ];

  const kecamatanOptions = [
    { value: '0', label: 'Klik Disini' }, // Default option
      ...kecamatan.map((item) => ({
      value: item.id,
      label: item.name.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    })),
  ];

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    nomor_kontak: ''
  });

  const [bankSampahData, setBankSampahData] = useState({
    tipe_bank_sampah: '',
    nama_bank_sampah: '',
    alamat: '',
    koordinat_lokasi: '',
    kontak: '',
    // jam_buka: null as string | null, // Update tipe data
    // jam_tutup: null as string | null, // Update tipe data
    // kapasitas: '',
    // luas_lokasi: '',
    dokumen_pendirian: null as File | null, // Tambahkan tipe data untuk dok
  });

  const handleBankSampahChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBankSampahData({
      ...bankSampahData,
      [e.target.name]: e.target.value
    });

    if(e.target.name === 'alamat'){
      if (alamatTimer) {
        clearTimeout(alamatTimer);
      }
  
      const timer = setTimeout(() => {
        setalamatJalanTempat(e.target.value); 
        updateAlamatLengkap();
      }, 500); 
  
      setAlamatTimer(timer);
    }
  };

  const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Casting target agar TypeScript mengenali properti input
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setBankSampahData((prevData) => ({
      ...prevData,
      [target.name]: target.value
    }));
  
    if (target.name === 'alamat') {
      if (alamatTimer) {
        clearTimeout(alamatTimer);
      }
  
      const timer = setTimeout(() => {
        setalamatJalanTempat(target.value);
        updateAlamatLengkap();
      }, 500);
  
      setAlamatTimer(timer);
    }
  };

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!signUpError) return;

    const timer = setTimeout(() => {
      setsignUpError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [signUpError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.nama || !formData.email || !formData.password) {
      notification.error({
        message: "Form tidak valid",
        description: "Nama, Email, dan Password wajib diisi.",
      });
      return false;
    } else if (selectedIndex === 1 &&  (wilProvinsi == "Klik Disini" || wilKabupaten == "Klik Disini" || wilKecamatan == "Klik Disini" || alamatJalanTempat == "")){
      notification.error({
        message: "Form tidak valid",
        description: "Cek kembali isian data alamat Anda",
      });
      return false;
    }
    return true;
  };

  // Trigger the modal on submit
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsModalVisible(true); 
  };

  // Function to handle confirmation after the modal
  const handleConfirmSignUp = async () => {
    setIsModalVisible(false);
    setLoading(true);
   
    try {

      const dataBankSampah = new FormData();
      dataBankSampah.append('nama',formData.nama);
      dataBankSampah.append('email', formData.email);
      dataBankSampah.append('password', formData.password);
      dataBankSampah.append('nomor_kontak', formData.nomor_kontak);
      dataBankSampah.append('kategori', selectedKategori);
      dataBankSampah.append('nama_bank_sampah', bankSampahData.nama_bank_sampah);
      dataBankSampah.append('tipe_bank_sampah', bankSampahData.tipe_bank_sampah);
      dataBankSampah.append('kontak', bankSampahData.kontak);
      dataBankSampah.append('provinsi', selectedProvinsi);
      dataBankSampah.append('kabupaten', selectedKabupaten);
      dataBankSampah.append('kecamatan', selectedKecamatan);
      dataBankSampah.append('alamat', alamatJalanTempat);
      dataBankSampah.append('koordinat_lokasi', bankSampahData.koordinat_lokasi);

      if (bankSampahData.dokumen_pendirian) {
          dataBankSampah.append('dokumen_pendirian', bankSampahData.dokumen_pendirian);
      }
     
      const message = await HandleSignUp(selectedIndex, formData, selectedKategori, dataBankSampah);

      notification.success({
        message: "Sign Up Berhasil!",
        description: message,
      });

      setTimeout(() => {
        navigate('/login'); 
      }, 1000);
    } catch (error: any) { 
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat sign up.";
      setsignUpError(errorMessage);
      notification.error({
        message: "Sign Up Gagal!",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
    },
    maxFiles: 1,  
    maxSize: 20 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setBankSampahData({
          ...bankSampahData,
          dokumen_pendirian: acceptedFiles[0], 
        });
      }
    },
  });

  const handlePreview = () => {
    setPreviewVisible(true); // Buka modal saat tombol Preview diklik
  };

  const handleClosePreview = () => {
    setPreviewVisible(false); // Tutup modal saat modal ditutup
  };

  useEffect(() => {
    if (window.google && mapRef.current) {
      const initialCoords = { lat: -6.200000, lng: 106.816666 }; // Default to Jakarta
      const newMap = new google.maps.Map(mapRef.current, {
        center: initialCoords,
        zoom: 13,
      });
      setMap(newMap);
  
      const newMarker = new google.maps.Marker({
        position: initialCoords,
        map: newMap,
        draggable: true,
      });
      setMarker(newMarker);
  
      newMarker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng;
        if (latLng) {
          const coords = `${latLng.lat()},${latLng.lng()}`;
          setBankSampahData((prevData) => ({
            ...prevData,
            koordinat_lokasi: coords,
          }));
        }
      });
  
      newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng;
        if (latLng) {
          newMarker.setPosition(latLng);
          const coords = `${latLng.lat()},${latLng.lng()}`;
          setBankSampahData((prevData) => ({
            ...prevData,
            koordinat_lokasi: coords,
          }));
        }
      });
    }
  }, [selectedIndex, mapRef]);  
  

  // Load the Google Maps script dynamically
  useEffect(() => {
    if (!window.google) {
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          // Setelah script dimuat, setup peta dan marker
          if (mapRef.current) {
            const initialCoords = { lat: -6.200000, lng: 106.816666 }; // Default to Jakarta
            const newMap = new google.maps.Map(mapRef.current, {
              center: initialCoords,
              zoom: 13,
            });
            setMap(newMap);
  
            const newMarker = new google.maps.Marker({
              position: initialCoords,
              map: newMap,
              draggable: true,
            });
            setMarker(newMarker);
  
            newMarker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
              const latLng = event.latLng;
              if (latLng) {
                const coords = `${latLng.lat()},${latLng.lng()}`;
                setBankSampahData((prevData) => ({
                  ...prevData,
                  koordinat_lokasi: coords,
                }));
              }
            });
  
            newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
              const latLng = event.latLng;
              if (latLng) {
                newMarker.setPosition(latLng);
                const coords = `${latLng.lat()},${latLng.lng()}`;
                setBankSampahData((prevData) => ({
                  ...prevData,
                  koordinat_lokasi: coords,
                }));
              }
            });
          }
        };
        document.head.appendChild(script);
      };
      loadScript();
    }
  }, [GOOGLE_MAPS_API_KEY]);
  

  const previewButton = acceptedFiles.length > 0 && (
    <button
    type="button"
    onClick={handlePreview}
    className="mt-4 px-4 py-2 bg-white text-grey-800 border-solid border-slate-800 border-2 rounded hover:bg-slate-300"
  >
    <EyeOutlined /> Preview File
  </button>
  );
  
  // Menyediakan preview file jika ada yang diunggah
  const filePreview = acceptedFiles.length > 0 
  ? acceptedFiles[0].name 
  : 'Tidak ada file yang dipilih';

  const fileError = fileRejections.length > 0 ? (
    <p className="text-red-600">Format file tidak diterima. Silakan unggah file dengan format .pdf, .docx, .jpg, .jpeg, atau .png</p>
  ) : null;


  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
    }
  };
  
  return (
    <section>
      <Helmet>
        <title>{appName}</title>
      </Helmet>
      <div className="pt-16 flex justify-center mt-20 sm:mt-10 mb-20"> 
        <div className="lg:max-w-6xl sm:max-w-3xl md:max-w-5xl bg-white/90 border border-white/20 rounded-lg shadow-lg p-6 space-y-4 w-full min-w-[300px] ml-[10px] mr-[10px]">
          <h1 className="text-4xl font-bold text-gray-800 text-left mb-10">Sign Up</h1>
          <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputElement
                inputClass="mb-6"
                forwhat="nama"
                labelMessage="Nama"
                typeInput="text"
                inputName="nama"
                inputPlaceholder="Masukkan Nama Anda"
                value={formData.nama}
                onChange={handleChange}
              />
              <InputElement
                inputClass="mb-6"
                forwhat="email"
                labelMessage="Email"
                typeInput="text"
                inputName="email"
                inputPlaceholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputElement
                inputClass="mb-6"
                forwhat="nomor_kontak"
                labelMessage="Nomor Kontak"
                typeInput="text"
                inputName="nomor_kontak"
                inputPlaceholder="Masukkan Nomor Kontak"
                value={formData.nomor_kontak}
                onChange={handleChange}
              />
              {/* <SelectElement
                inputClass="mb-6"
                forwhat="kategori" 
                labelMessage="Pilih Kategori"
                id="kategori"
                name="kategori"
                value={selectedKategori}
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  setSelectedIndex(selectedIndex); // Update selectedIndex state
                  setSelectedKategori(e.target.value);
                }}
                options={kategoriOptions}
              /> */}
              <InputElement
                inputClass="mb-6"
                forwhat="password"
                labelMessage="Password"
                typeInput="password"
                inputName="password"
                inputPlaceholder="****"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
            </div>
            
            {selectedIndex === 1 && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Data Bank Sampah</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputElement
                  inputClass="mb-6"
                  forwhat="tipe_bank_sampah"
                  labelMessage="Tipe Bank Sampah"
                  typeInput="text"
                  inputName="tipe_bank_sampah"
                  inputPlaceholder="Masukkan Tipe Bank Sampah"
                  value={bankSampahData.tipe_bank_sampah}
                  onChange={handleBankSampahChange}
                />
                <InputElement
                  inputClass="mb-6"
                  forwhat="nama_bank_sampah"
                  labelMessage="Nama Bank Sampah"
                  typeInput="text"
                  inputName="nama_bank_sampah"
                  inputPlaceholder="Masukkan Nama Bank Sampah"
                  value={bankSampahData.nama_bank_sampah}
                  onChange={handleBankSampahChange}
                />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchableSelect
                    inputClass="mb-6"
                    forwhat="provinsi"
                    labelMessage="Pilih Provinsi"
                    id="provinsi"
                    name="provinsi"
                    value={selectedProvinsi}
                    onChange={handleProvinsiChange}
                    options={provinsiOptions}
                    onSearch={handleProvinsiSearchChange} // Menangani perubahan input
                  />
                  <SearchableSelect
                    inputClass="mb-6"
                    forwhat="kabupaten"
                    labelMessage="Pilih Kabupaten / Kota"
                    id="kabupaten"
                    name="kabupaten"
                    value={selectedKabupaten}
                    onChange={handleKabupatenChange}
                    options={kabupatenOptions}
                    onSearch={handleKabupatenSearchChange} 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchableSelect
                    inputClass="mb-6"
                    forwhat="kecamatan"
                    labelMessage="Pilih Kecamatan / Distrik"
                    id="kecamatan"
                    name="kecamatan"
                    value={selectedKecamatan}
                    onChange={handleKecamatanChange}
                    options={kecamatanOptions}
                    onSearch={handleKecamatanSearchChange} 
                  />
                <InputElement
                  inputClass="mb-6"
                  forwhat="alamat"
                  labelMessage="Nama Jalan, Gedung, atau Tempat"
                  typeInput="text"
                  inputName="alamat"
                  inputPlaceholder="Masukkan Alamat Jalan atau Tempat"
                  value={bankSampahData.alamat}
                  onChange={handleBankSampahChange}
                  onInput={handleInputEvent}
                  onPaste={handleInputEvent}
                />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <InputElement
                  inputClass="mb-6"
                  forwhat="koordinat_lokasi"
                  labelMessage="Koordinat Lokasi"
                  typeInput="text"
                  inputName="koordinat_lokasi"
                  inputPlaceholder="Koordinat Lokasi (Latitude, Longitude)"
                  value={bankSampahData.koordinat_lokasi}
                  onChange={handleBankSampahChange}
                  readOnly
                />
                </div>
                <div className="mt-4 mb-4">
                  <label htmlFor="map" className="block mb-2 text-sm font-medium text-gray-700">
                    Pin Point Lokasi:
                  </label>
                  <div
                    id="map"
                    ref={mapRef}
                    style={{ width: "100%", height: "300px", borderRadius: "8px" }}
                  ></div>
                </div>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputElement
                    inputClass="mb-6"
                    forwhat="kontak"
                    labelMessage="Kontak"
                    typeInput="text"
                    inputName="kontak"
                    inputPlaceholder="Masukkan Kontak"
                    value={bankSampahData.kontak}
                    onChange={handleBankSampahChange}
                  />
                </div> */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TimePickerElement
                      inputClass="mb-6 w-full"
                      forwhat="jam_buka"
                      labelMessage="Jam Buka"
                      inputName="jam_buka"
                      inputPlaceholder="Jam Buka"
                      value={bankSampahData.jam_buka ? dayjs(bankSampahData.jam_buka, "HH:mm") : null} // Pastikan format sesuai
                      onChange={(time) => 
                        setBankSampahData({
                          ...bankSampahData,
                          jam_buka: time, // Nilai yang diterima sudah dalam format string "HH:mm"
                        })
                      }
                    />
                    <TimePickerElement
                      inputClass="mb-6 w-full"
                      forwhat="jam_tutup"
                      labelMessage="Jam Tutup"
                      inputName="jam_tutup"
                      inputPlaceholder="Jam Tutup"
                      value={bankSampahData.jam_tutup ? dayjs(bankSampahData.jam_tutup, "HH:mm") : null} // Format juga disesuaikan
                      onChange={(time) => 
                        setBankSampahData({
                          ...bankSampahData,
                          jam_tutup: time, // Nilai yang diterima sudah dalam format string "HH:mm"
                        })
                      }
                    />
                  </div> */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputElement
                  inputClass="mb-6"
                  forwhat="kapasitas"
                  labelMessage="Kapasitas"
                  typeInput="number"
                  inputName="kapasitas"
                  inputPlaceholder="Masukkan Kapasitas"
                  value={bankSampahData.kapasitas}
                  onChange={handleBankSampahChange}
                />
                <InputElement
                  inputClass="mb-6"
                  forwhat="luas_lokasi"
                  labelMessage="Luas Lokasi (m²)"
                  typeInput="number"
                  inputName="luas_lokasi"
                  inputPlaceholder="Masukkan Luas Lokasi"
                  value={bankSampahData.luas_lokasi}
                  onChange={handleBankSampahChange}
                />
                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div {...getRootProps()} className="border-dashed border-2 border-gray-500 p-6 bg-gray-100 cursor-pointer">
                    <input {...getInputProps()} />
                    <p className="text-center text-gray-700">Pilih atau Seret Dokumen Legalitas</p>
                    <p className="text-center text-gray-400">{filePreview}</p>
                  </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {fileError}
                  {previewButton}
                  
                  <Modal
                    title="Preview File"
                    visible={previewVisible}
                    onCancel={handleClosePreview}
                    footer={null}
                    className="content-center max-h-[400px] overflow-y-auto"
                  >
                    {/* Contoh sederhana preview berdasarkan tipe file */}
                    {acceptedFiles.length > 0 && acceptedFiles[0].type.includes("image/") ? (
                      <img
                        src={URL.createObjectURL(acceptedFiles[0])}
                        alt="Preview"
                        style={{ maxWidth: "100%" }}
                      />
                    ) : acceptedFiles.length > 0 && acceptedFiles[0].type === "application/pdf" ? (
                      <iframe
                        src={URL.createObjectURL(acceptedFiles[0])}
                        title="PDF Preview"
                        style={{ width: "100%", height: "300px", border: "none" }}
                      ></iframe>
                    ) : (
                      <p>{filePreview}</p> 
                    )}
                  </Modal>
                </div>
              </>
            )}

            <Button
              message={loading ? "Loading..." : "Sign Up"} 
              variant="bg-[#7f0353] w-full hover:bg-green-900"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spin indicator={loadingIndicator} /> : null} 
            </Button>
          </form>
          <p className="text-slate-500 mt-4 text-center">Sudah memiliki akun? silakan&nbsp;
            <Link to="/Login" className="text-[#7f0353]">
              <b>Login</b>
            </Link>
          </p>
        </div>
      </div>

      <Modal
        title="Konfirmasi Pendaftaran"
        visible={isModalVisible}
        onOk={handleConfirmSignUp} 
        onCancel={() => setIsModalVisible(false)} 
        okText="Ya, Daftar"
        cancelText="Batal"
      >
        <p>Apakah Anda yakin semua data sudah benar ?</p>
      </Modal>
    </section>
  );
};

export default SignUpForm;
