import { useState } from "react";
import { Modal, Input, Button, Select, Checkbox, notification, Radio } from "antd";
import { FaTshirt, FaPlus } from "react-icons/fa";
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
  media?: { url: string; type: string }[];
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
  const [genderCategory, setGenderCategory] = useState<string | null>(null);

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

  // const removeImage = (index: number) => {
  //   if ((productData.images ?? []).length > 1) {
  //     setProductData((prev) => ({
  //       ...prev,
  //       images: (prev.images ?? []).filter((_, i) => i !== index),
  //     }));
  //   }
  // };

  const removeMedia = (index: number) => {
    setProductData((prev) => {
      const imagesLength = prev.images?.length ?? 0;
  
      if (index < imagesLength) {
        // Hapus dari images
        return {
          ...prev,
          images: prev.images?.filter((_, i) => i !== index) ?? [],
        };
      } else {
        // Hapus dari media (dengan menyesuaikan index)
        const mediaIndex = index - imagesLength;
        return {
          ...prev,
          media: prev.media?.filter((_, i) => i !== mediaIndex) ?? [],
        };
      }
    });
  };
  

  // Handle perubahan input
  const handleChange = (key: keyof Product, value: any) => {
    setProductData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle Upload Media
  const onDrop = (acceptedFiles: File[]) => {
    const newMedia = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type, // Menyimpan tipe media
    }));
  
    setProductData((prev) => ({
      ...prev,
      media: [...(prev.media || []), ...newMedia],
    }));
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] }, // Tambahkan dukungan video
    multiple: true,
  });
  

  // Simpan produk ke LocalStorage
  const handleSaveProduct = async () => {
  if (!productData.name || !productData.price || !productData.merk || !primaryCategory || !genderCategory) {
    return alert("Harap isi semua bidang wajib, termasuk kategori utama!");
  }

  const existingProducts = JSON.parse(localStorage.getItem("additionalProducts") || "[]");
  const newProductID = `P${(existingProducts.length + 1).toString().padStart(4, "0")}`;

  // Proses semua media (gambar & video) menjadi Base64 jika perlu
  const uploadedMedia = await Promise.all(
    (productData.media || []).map(async (media) => {
      if (media.url.startsWith("blob:")) {
        return {
          url: await convertBlobToBase64(media.url),
          type: media.type,
        };
      }
      return media;
    })
  );

  const newProduct = {
    ...productData,
    productID: newProductID,
    media: uploadedMedia,
    category: Array.from(new Set([genderCategory, primaryCategory, ...(productData.category || [])])),
  };

  localStorage.setItem("additionalProducts", JSON.stringify([...existingProducts, newProduct]));

  window.dispatchEvent(new Event("additionalProductsUpdated"));
  setIsModalOpen(false);
  notification.success({ message: "Produk baru berhasil ditambahkan!" });
};



const convertBlobToBase64 = (blobUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    fetch(blobUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => resolve(""));
  });
};


  return (
    <>
      {/* Tombol untuk membuka modal */}
      <button
        className="bg-[#7f0353] text-white h-[40px] px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus className="inline sm:hidden text-white text-lg" />
        <FaTshirt className="hidden sm:inline text-white text-lg" />
        <span className="hidden sm:inline">Tambah Produk</span>
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
    maxHeight: "50vh",
    overflowY: "hidden",
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
    <Input type="text" value={formattedPrice} onChange={handlePriceChange} placeholder="Masukkan harga" />

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

    {/* Kategori Utama */}
    <label>Kategori *</label>
    <Radio.Group onChange={(e) => setPrimaryCategory(e.target.value)} value={primaryCategory} className="flex flex-col">
      <Radio value="Kemeja/Kaos">Kemeja/Kaos</Radio>
      <Radio value="Celana">Celana</Radio>
      <Radio value="Sepatu/Sandal">Sepatu/Sandal</Radio>
    </Radio.Group>

    {/* Kategori Kelamin */}
    <label>Jenis Kelamin *</label>
    <Radio.Group onChange={(e) => setGenderCategory(e.target.value)} value={genderCategory} className="flex flex-col">
      <Radio value="Laki-laki">Laki-laki</Radio>
      <Radio value="Perempuan">Perempuan</Radio>
      <Radio value="Unisex">Unisex</Radio>
    </Radio.Group>

    {/* Kategori (Multiple) - Tidak Wajib */}
    <label>Kategori Lainnya</label>
    <Select mode="multiple" placeholder="Pilih Kategori" onChange={(value) => handleChange("category", value)} className="w-full">
      <Option value="Jaket">Jaket</Option>
      <Option value="Vintage">Vintage</Option>
      <Option value="Olahraga">Olahraga</Option>
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
    {/* <label>Upload Gambar *</label>
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
            <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl">
              X
            </button>
          )}
        </div>
      ))}
    </div> */}
  <label>Upload Gambar/Video *</label>
  <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
    <input {...getInputProps({ accept: "image/*,video/*" })} />
    <p>Seret & letakkan gambar/video di sini</p><p> atau klik untuk memilih</p>
  </div>

  <div className="flex flex-wrap gap-2 mt-2">
    {(productData.media ?? []).map((file, index) => (
      <div key={index} className="relative w-20 h-20 border rounded">
        {index === 0 && (
          <span className="absolute top-0 left-0 bg-black text-white text-xs px-1 rounded-br">Thumbnail</span>
        )}
        {file.type.startsWith("image/") ? (
          <img src={file.url} alt={`preview-${index}`} className="w-full h-full object-cover rounded" />
        ) : (
          <video controls className="w-full h-full object-cover rounded">
            <source src={file.url} type={file.type} />
            Browser Anda tidak mendukung video.
          </video>
        )}
        {(productData.media ?? []).length > 1 && (
          <button
            onClick={() => removeMedia(index)}
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
