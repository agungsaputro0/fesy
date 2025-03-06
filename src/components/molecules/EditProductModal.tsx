import { useState, useEffect } from "react";
import { Modal, Input, Button, Select, Checkbox, notification } from "antd";
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
};

type EditProdukModalProps = {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
};

const EditProductModal = ({ visible, onClose, product }: EditProdukModalProps) => {
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [formattedPrice, setFormattedPrice] = useState<string>("");

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

  const removeImage = (index: number) => {
    if ((productData.images ?? []).length > 1) {
      setProductData((prev) => ({
        ...prev,
        images: (prev.images ?? []).filter((_, i) => i !== index),
      }));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file)); // Membuat URL sementara untuk pratinjau
    setProductData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages], // Menyimpan gambar baru
    }));
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleSaveEdit = async () => {
    if (!productData.name || !productData.price || !productData.merk) {
      return alert("Harap isi semua bidang wajib!");
    }
  
    if (!productData.productID) {
      return alert("Produk tidak valid!"); // Pastikan productID ada
    }
  
    let imagesToSave = await Promise.all(
      (productData.images || []).map(async (img) => {
        if (img.startsWith("blob:")) {
          return await convertBlobToBase64(img);
        }
        return img;
      })
    );
  
    const editedProduct: Product = { 
      productID: productData.productID,
      userID: productData.userID ?? 0,
      name: productData.name ?? "", 
      price: productData.price ?? 0, 
      merk: productData.merk ?? "", 
      condition: productData.condition ?? "", 
      category: productData.category ?? [], 
      images: imagesToSave,
      bisaTukar: productData.bisaTukar ?? false,
      size: productData.size ?? "",
      description: productData.description ?? "",
      status: productData.status ?? 0,
    };
  
    // Ambil daftar produk yang sudah diperbarui sebelumnya dari localStorage
    let updatedProducts: Product[] = JSON.parse(localStorage.getItem("updatedProduct") || "[]");
  
    if (!Array.isArray(updatedProducts)) {
      updatedProducts = []; // Pastikan selalu berbentuk array
    }
  
    // Cek apakah produk dengan productID yang sama sudah ada
    const index = updatedProducts.findIndex(p => p.productID === editedProduct.productID);
  
    if (index !== -1) {
      // Jika ada, timpa datanya
      updatedProducts[index] = editedProduct;
    } else {
      // Jika tidak ada, tambahkan produk baru
      updatedProducts.push(editedProduct);
    }
  
    // Simpan kembali dalam bentuk array
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
        <Select mode="multiple" value={productData.category} onChange={(value) => handleChange("category", value)} className="w-full">
          <Option value="Jaket">Jaket</Option>
          <Option value="Vintage">Vintage</Option>
          <Option value="Kaos">Kaos</Option>
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

        <label>Upload Gambar *</label>
        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Seret & letakkan gambar di sini, atau klik untuk memilih</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
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
        </div>
      </div>
    </Modal>
  );
};

export default EditProductModal;
