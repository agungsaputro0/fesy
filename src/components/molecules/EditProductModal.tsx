import { useState, useEffect } from "react";
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
  color?: string;
  bisaTukar: boolean;
  size: string;
  description?: string;
  status?: number;
  media?: { url: string; type: string }[];
};

type EditProdukModalProps = {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
};

const EditProductModal = ({ visible, onClose, product }: EditProdukModalProps) => {
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [primaryCategory, setPrimaryCategory] = useState<string | null>(null);
  const [genderCategory, setGenderCategory] = useState<string | null>(null);

  useEffect(() => {
    if (productData.category) {
      // Tetapkan kategori utama hanya jika kategori tersebut ada
      if (productData.category.includes("Kemeja/Kaos")) {
        setPrimaryCategory("Kemeja/Kaos");
      } else if (productData.category.includes("Celana")) {
        setPrimaryCategory("Celana");
      } else if (productData.category.includes("Sepatu/Sandal")) {
        setPrimaryCategory("Sepatu/Sandal");
      }
  
      // Tetapkan kategori kelamin hanya jika kategori tersebut ada
      if (productData.category.includes("Laki-laki")) {
        setGenderCategory("Laki-laki");
      } else if (productData.category.includes("Perempuan")) {
        setGenderCategory("Perempuan");
      } else if (productData.category.includes("Unisex")) {
        setGenderCategory("Unisex");
      }
    }
  }, [productData.category]);
  
  // Filter hanya kategori lainnya
  const filteredCategories = productData.category?.filter(
    (cat) => !["Kemeja/Kaos", "Celana", "Sepatu/Sandal", "Laki-laki", "Perempuan", "Unisex"].includes(cat)
  );
  

  useEffect(() => {
    if (product) {
      setProductData(product);
      setFormattedPrice(new Intl.NumberFormat("id-ID").format(product.price));
    }
  }, [product]);

  const handleChange = (key: keyof Product, value: any) => {
    setProductData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
    setFormattedPrice(numericValue ? new Intl.NumberFormat("id-ID").format(numericValue) : "");
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
  

  const handleSaveEdit = async () => {
    if (!productData.name || !productData.price || !productData.merk || !primaryCategory || !genderCategory) {
      return alert("Harap isi semua bidang wajib, termasuk kategori utama!");
    }
  
    if (!productData.productID) {
      return alert("Produk tidak valid!");
    }
  
    // **Proses semua media (gambar & video)**
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
  
    // **Gabungkan kategori utama dan gender dengan kategori lainnya**
    const updatedCategories = Array.from(
      new Set([primaryCategory, genderCategory, ...(productData.category || [])])
    );
    
    let imagesToSave = await Promise.all(
      (productData.images || []).map(async (img) => {
        if (img.startsWith("blob:")) {
          return await convertBlobToBase64(img);
        }
        return img;
      })
    );

    // **Data produk setelah diperbarui**
    const editedProduct: Product = {
      ...productData,
      productID: productData.productID, // Pastikan productID valid
      userID: productData.userID ?? 0,  // Pastikan userID selalu number
      name: productData.name ?? "", 
      price: productData.price ?? 0, 
      merk: productData.merk ?? "", 
      condition: productData.condition ?? "", 
      category: updatedCategories ?? [], 
      images: imagesToSave,
      bisaTukar: productData.bisaTukar ?? false,
      size: productData.size ?? "",
      description: productData.description ?? "",
      status: productData.status ?? 0,
      media: uploadedMedia,
    };
    
  
    // **Ambil daftar produk dari localStorage**
    let updatedProducts: Product[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
  
    if (!Array.isArray(updatedProducts)) {
      updatedProducts = [];
    }
  
    // **Cek apakah produk sudah ada, lalu perbarui atau tambahkan**
    const index = updatedProducts.findIndex((p) => p.productID === editedProduct.productID);
  
    if (index !== -1) {
      updatedProducts[index] = editedProduct;
    } else {
      updatedProducts.push(editedProduct);
    }
  
    // **Simpan kembali ke localStorage**
    localStorage.setItem("updatedProduct", JSON.stringify(updatedProducts));
  
    window.dispatchEvent(new Event("updatedProductUpdated"));
  
    notification.success({ message: "Berhasil!", description: "Produk berhasil diperbarui!" });
    onClose();
  };
  
  
  
  
  // 🔄 Fungsi untuk mengubah blob menjadi Base64
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
    <Modal
      title={
        <div className="flex gap-2 mb-5 pb-4 border-b">
          <FaTshirt className="text-[#7f0353] text-lg h-6 w-6" />
          <span>Edit Produk</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Batal
        </Button>,
        <Button key="save" type="primary" className="bg-[#7f0353]" onClick={handleSaveEdit}>
          Simpan Perubahan
        </Button>,
      ]}
      bodyStyle={{ maxHeight: "50vh", overflowY: "auto", paddingRight: "8px" }}
    >
      <div className="flex flex-col space-y-4">
        <label>Nama Produk *</label>
        <Input value={productData.name} onChange={(e) => handleChange("name", e.target.value)} />

        <label>Harga (Rp) *</label>
        <Input type="text" value={formattedPrice} onChange={handlePriceChange} placeholder="Masukkan harga" />

        <label>Merk *</label>
        <Input value={productData.merk} onChange={(e) => handleChange("merk", e.target.value)} />

        <label>Kondisi *</label>
        <Select value={productData.condition} onChange={(value) => handleChange("condition", value)} className="w-full">
          <Option value="Baru">Baru</Option>
          <Option value="Hampir Baru">Hampir Baru</Option>
          <Option value="Bekas">Bekas</Option>
        </Select>

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

        <label>Kategori *</label>
        <Select mode="multiple" value={filteredCategories} onChange={(value) => handleChange("category", value)} className="w-full">
        <Option value="Jaket">Jaket</Option>
        <Option value="Vintage">Vintage</Option>
        <Option value="Olahraga">Olahraga</Option>
        </Select>

        <label>Warna</label>
        <Input value={productData.color} onChange={(e) => handleChange("color", e.target.value)} />

        <label>Ukuran *</label>
        <Input value={productData.size} onChange={(e) => handleChange("size", e.target.value)} />

        <Checkbox checked={productData.bisaTukar} onChange={(e) => handleChange("bisaTukar", e.target.checked)}>
          Bisa Tukar
        </Checkbox>

        <label>Deskripsi Produk *</label>
        <Input.TextArea value={productData.description} rows={4} onChange={(e) => handleChange("description", e.target.value)} />

        {/* <label>Upload Gambar *</label>
        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Seret & letakkan gambar di sini, atau klik untuk memilih</p>
        </div> */}

        {/* <div className="flex flex-wrap gap-2 mt-2">
          {(productData.images ?? []).map((img, index) => (
            <div key={index} className="relative w-20 h-20 border rounded">
              
              <img src={img.startsWith("data:image/") ? img : img.startsWith("blob:") ? img : img ? `../${img}` : "../assets/img/produk/dummy.jpg"} alt={`preview-${index}`} className="w-full h-full object-cover rounded" onError={(e) => (e.currentTarget.src = "../assets/img/produk/dummy.jpg")} />
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
  {([
    ...(productData.images ?? []).map(url => ({ url, type: "image/" })), 
    ...(productData.media ?? [])
  ]).map((file, index) => (
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
      {([...((productData.images ?? []) as string[]), ...(productData.media ?? [])]).length > 1 && (
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
  );
};

export default EditProductModal;
