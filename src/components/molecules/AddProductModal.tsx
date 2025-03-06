import { useState } from "react";
import { Modal, Input, Button, Select, Checkbox, notification, Radio } from "antd";
import { FaTshirt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

const { Option } = Select;

type Product = {
  productID: string;
  userID: number;
  name: string;
  images: string[];
  price: number;
  merk: string;
  condition: string;
  category: string[];
  color: string;
  bisaTukar: boolean;
  size: string;
  description: string;
  status: number;
};

const TambahProdukModal = ({
    userID
  }: {
    userID: number;
    isOpen: boolean;
    onClose: () => void;
  }) => {  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState<Partial<Product>>({
    userID,
    name: "",
    price: 0,
    merk: "",
    condition: "",
    category: [],
    color: "",
    bisaTukar: false,
    size: "",
    description: "",
    images: [],
    status: 1,
  });
  //const [price, setPrice] = useState<number | "">("");
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [primaryCategory, setPrimaryCategory] = useState<string | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
  
    //setPrice(numericValue);
    setFormattedPrice(numericValue ? formatPrice(numericValue) : "");
  
    // Mengirimkan nilai numerik ke handleChange
    handleChange("price", numericValue || 0);
  };

  const removeImage = (index: number) => {
    if ((productData.images ?? []).length > 1) {
      setProductData((prev) => ({
        ...prev,
        images: (prev.images ?? []).filter((_, i) => i !== index),
      }));
    }
  };

  // Handle perubahan input
  const handleChange = (key: keyof Product, value: any) => {
    setProductData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle Upload Media
  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => URL.createObjectURL(file));
    setProductData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newImages],
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Simpan produk ke LocalStorage
  const handleSaveProduct = async () => {
    if (!productData.name || !productData.price || !productData.merk || !primaryCategory) {
        return alert("Harap isi semua bidang wajib, termasuk kategori utama!");
    }

    const existingProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
    const newProductID = `P${(existingProducts.length + 1).toString().padStart(4, "0")}`; // Auto-ID

    const uploadedImages: string[] = [];

    if (productData.images && Array.isArray(productData.images)) {
        for (let i = 0; i < productData.images.length; i++) {
            const image = productData.images[i];

            if (image.startsWith("blob:")) {
                try {
                    const base64Image = await convertBlobToBase64(image);
                    uploadedImages.push(base64Image); // Simpan dalam Base64
                } catch (error) {
                    console.error("Gagal mengonversi gambar ke Base64:", error);
                }
            } else {
                uploadedImages.push(image); // Simpan langsung jika bukan blob
            }
        }
    }

    // Gabungkan kategori utama dengan kategori tambahan, hindari duplikasi
    const finalCategories = Array.from(new Set([primaryCategory, ...(productData.category || [])]));

    const newProduct = {
        ...productData,
        productID: newProductID,
        images: uploadedImages,
        category: finalCategories, // Pastikan kategori utama masuk ke kategori produk
    };

    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem("additionalProducts", JSON.stringify(updatedProducts));

    // Kirim event agar komponen lain tahu ada produk baru
    window.dispatchEvent(new Event("additionalProductsUpdated"));

    setIsModalOpen(false);
    notification.success({ message: "Selamat", description: "Produk baru berhasil ditambahkan!" });
};


const convertBlobToBase64 = (blobUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    console.log("Mencoba fetch:", blobUrl);

    fetch(blobUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Fetch gagal: ${res.status} ${res.statusText}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(""); // Jika gagal baca blob, tetap lanjut tanpa error
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn("Blob kadaluwarsa atau tidak bisa diakses, melewati proses ini:", err);
        resolve(""); // Tetap lanjut tanpa error
      });
  });
};

  return (
    <>
      {/* Tombol untuk membuka modal */}
      <button
        className="bg-[#7f0353] text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
        onClick={() => setIsModalOpen(true)}
      >
        <FaTshirt className="text-white text-lg" />
        <span>Tambah Produk</span>
      </button>

      {/* Modal Tambah Produk */}
      <Modal
        title={[
          <div className="flex gap-2 mb-5 pb-4 border-b">
            <FaTshirt className="text-[#7f0353] text-lg h-6 w-6" />
            <span>Tambah Produk</span>
          </div>
        ]}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>,
          <Button key="save" type="primary" className="bg-[#7f0353]" onClick={handleSaveProduct}>
            Simpan Produk
          </Button>,
        ]}
        bodyStyle={{
            maxHeight: "50vh", // Batasi tinggi modal agar tidak terlalu besar
            overflowY: "hidden", // Sembunyikan overflow dari modal utama
            display: "flex",
            flexDirection: "column",
          }}
      >
        <div className="flex flex-col space-y-4" style={{ overflowY: "auto", paddingRight: "8px" }}>
          {/* Nama Produk */}
          <label>Nama Produk *</label>
          <Input onChange={(e) => handleChange("name", e.target.value)} />

          {/* Harga */}
          <label>Harga (Rp) *</label>
          <Input
            type="text"
            value={formattedPrice}
            onChange={handlePriceChange}
            placeholder="Masukkan harga"
          />

          {/* Merk */}
          <label>Merk *</label>
          <Input onChange={(e) => handleChange("merk", e.target.value)} />

          {/* Kondisi */}
          <label>Kondisi *</label>
          <Select placeholder="Pilih Kondisi" onChange={(value) => handleChange("condition", value)} className="w-full">
            <Option value="Baru">Baru</Option>
            <Option value="Hampir Baru">Hampir Baru</Option>
            <Option value="Bekas">Bekas</Option>
          </Select>

          <label>Kategori Utama *</label>
            <Radio.Group onChange={(e) => setPrimaryCategory(e.target.value)} value={primaryCategory}>
              <Radio value="Kemeja/Kaos">Kemeja/Kaos</Radio>
              <Radio value="Celana">Celana</Radio>
              <Radio value="Sepatu/Sandal">Sepatu/Sandal</Radio>
            </Radio.Group>

          {/* Kategori (Multiple) */}
          <label>Kategori *</label>
          <Select mode="multiple" placeholder="Pilih Kategori" onChange={(value) => handleChange("category", value)} className="w-full">
            <Option value="Jaket">Jaket</Option>
            <Option value="Vintage">Vintage</Option>
            <Option value="Kaos">Kaos</Option>
          </Select>

          {/* Warna (Opsional) */}
          <label>Warna</label>
          <Input onChange={(e) => handleChange("color", e.target.value)} />

          {/* Ukuran */}
          <label>Ukuran *</label>
          <Input onChange={(e) => handleChange("size", e.target.value)} />

          {/* Bisa Tukar */}
          <Checkbox onChange={(e) => handleChange("bisaTukar", e.target.checked)}>Bisa Tukar</Checkbox>

          {/* Deskripsi Produk */}
          <label>Deskripsi Produk *</label>
          <Input.TextArea rows={4} style={{ minHeight: "80px" }} onChange={(e) => handleChange("description", e.target.value)} />

          {/* Upload Media */}
          <label>Upload Gambar *</label>
          <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Seret & letakkan gambar di sini, atau klik untuk memilih</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {(productData.images ?? []).map((img, index) => (
              <div key={index} className="relative w-20 h-20 border rounded">
                {index === 0 && (
                  <span className="absolute top-0 left-0 bg-black text-white text-xs px-1 rounded-br">Thumbnail</span>
                )}
                <img src={img} alt={`preview-${index}`} className="w-full h-full object-cover rounded" />
                {(productData.images ?? []).length > 1 && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
                  >
                    X
                  </button>
                )}
              </div>
               ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TambahProdukModal;
