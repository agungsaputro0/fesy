import axios from 'axios';
import { useState, useEffect } from 'react';
const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

interface SignUpResponse {
    message: string;
}

interface Kategori {
    kategori_id: string;
    nama: string;
}

interface Provinsi {
    id: string;
    name: string;
}

interface Kabupaten {
    id: string;
    name: string;
}

interface Kecamatan {
    id: string;
    name: string;
}

export const useFetchKategori = () => {
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchKategori = async () => {
        try {
          const response = await axios.get(`${baseURL}/get_user_kategori`);
          setKategori(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch categories');
          setLoading(false);
        }
      };
  
      fetchKategori();
    }, []);
  
    return { kategori, loading, error };
  };

  export const useFetchProvinsi = (searchTerm: string) => {
    const [provinsi, setProvinsi] = useState<Provinsi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProvinsi = async () => {
        setLoading(true);
        try {
          // Mengirimkan query search parameter ke backend
          const response = await axios.get(`${baseURL}/get_provinsi`, {
            params: { search: searchTerm } // menggunakan params untuk query string
          });
  
          // Menyimpan data provinsi yang diterima
          setProvinsi(response.data);
          setLoading(false);
        } catch (err) {
          // Menangani error jika gagal mengambil data
          setError('Failed to fetch provinsi');
          setLoading(false);
        }
      };
  
      // Memastikan hanya melakukan pencarian jika searchTerm memiliki panjang minimal 3 karakter
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        fetchProvinsi();
      }
    }, [searchTerm]); // Melakukan fetch setiap kali searchTerm berubah
  
    return { provinsi, loading, error };
  };

  export const useFetchKabupaten = (provinsiId: string | null, searchTerm: string) => {
    const [kabupaten, setKabupaten] = useState<Kabupaten[]>([]);
    const [loading, setLoading] = useState(false); // Default tidak loading
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKabupaten = async () => {
            if (!provinsiId) return; // Tidak ada provinsi_id, tidak melakukan fetch

            setLoading(true); // Mulai loading
            try {
                const response = await axios.get(`${baseURL}/get_kabupaten_kota/${provinsiId}`, {
                    params: searchTerm ? { search: searchTerm } : {}, // Kirim search jika ada
                });
                setKabupaten(response.data);
                setError(null); // Reset error jika berhasil
            } catch (err) {
                setError('Failed to fetch kabupaten');
                setKabupaten([]); // Reset kabupaten jika gagal
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        if (provinsiId && (searchTerm.length >= 3 || searchTerm.length === 0)) {
            fetchKabupaten();
        }
    }, [provinsiId, searchTerm]);

    return { kabupaten, loading, error };
}
  

export const useFetchKecamatan = (kabupatenId: string | null, searchTerm: string) => {
  const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchKecamatan = async () => {
          if (!kabupatenId) return; 

          setLoading(true); 
          try {
              const response = await axios.get(`${baseURL}/get_kecamatan_distrik/${kabupatenId}`, {
                  params: searchTerm ? { search: searchTerm } : {}, 
              });
              setKecamatan(response.data);
              setError(null); 
          } catch (err) {
              setError('Failed to fetch Kecamatan');
              setKecamatan([]); 
          } finally {
              setLoading(false); 
          }
      };

      if (kabupatenId && (searchTerm.length >= 3 || searchTerm.length === 0)) {
        fetchKecamatan();
      }
  }, [kabupatenId, searchTerm]);

  return { kecamatan, loading, error };
}

export const handleSignUpUser = async (UserData: any) => {
    try {
        const response = await axios.post<SignUpResponse>(`${baseURL}/user_registration`, UserData);
        return response.data.message;
    } catch (error) {
        throw error;
    }
};

export const handleSignUpUserBankSampah = async (formData: FormData) => {
    try {
      const response = await axios.post(`${baseURL}/bank_sampah_registration`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,  // Jika perlu cookie atau session
      });
      return response.data.message;
    } catch (error: any) {
      console.error("Error while submitting form:", error);
      const message = error?.response?.data?.message || error.message || "Gagal mengirim data laporan pembayaran.";
      throw new Error(message);
    }
  };

export const HandleSignUp = async (
    selectedIndex: number | null,
    data: any,
    selectedKategori: string,
    bankSampahData: FormData | null
) => {
    try {
        if (selectedIndex === 1) {
          if (!bankSampahData) {
            throw new Error("Data bank sampah tidak boleh kosong");
          }
          return await handleSignUpUserBankSampah(bankSampahData);
        } 
        else if (selectedIndex === 2) {
                
        } 
        else if(selectedIndex === 3){

        } 
        else if (selectedIndex === 4) {
            const DataForSend = {
                nama: data.nama,
                email: data.email,
                nomor_kontak: data.nomor_kontak,
                password: data.password,
                kategori: selectedKategori,
            };
            return await handleSignUpUser(DataForSend);
        } else {
            throw new Error("Kategori tidak dipilih atau tidak valid");
        }
    } catch (error) {
        console.error('Penambahan User gagal:', error);
        throw error;
    }
};