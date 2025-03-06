import { useEffect, useState } from "react";
import { Modal, Button, Radio, Input, Form, notification } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

interface Address {
  id: number;
  label: string;
  provinsi: string;
  kabupaten: string; // Menampung data Kabupaten atau Kota
  detail: string;
  kodePos: string;
  alamatDipilih: boolean;
}

interface User {
  id: number;
  nama: string;
  telepon: string;
  alamat: Address[];
  email: string;
  password: string;
  fotoProfil: string;
  role: number;
}

const AddressPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [form] = Form.useForm();
  
  // Helper: format alamat tanpa menghasilkan koma berlebih untuk data kosong
  const formatAddress = (addr: Address) => {
    const parts = [addr.label, addr.detail, addr.kabupaten, addr.provinsi, addr.kodePos];
    return parts.filter((p) => p && p.trim() !== "").join(", ");
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setIsEditModalOpen(true);
    form.setFieldsValue(addr); // Mengisi form dengan data alamat yang dipilih
  };

  const handleSaveEditAddress = (values: any) => {
    if (!user || !editingAddress) return;
    
    const updatedAlamat = user.alamat.map((addr) =>
      addr.id === editingAddress.id ? { ...addr, ...values } : addr
    );
  
    const updatedUser = { ...user, alamat: updatedAlamat };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    notification.success({ message: "Alamat diperbarui", description: "Alamat berhasil diperbarui!" });
    
    setIsEditModalOpen(false);
  };
  
  useEffect(() => {
    // Ambil data user dari localStorage
    const currentUser: User = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser?.id) {
      let updatedAlamat = currentUser.alamat;
      
      // Cek apakah sudah ada alamat yang dipilih
      const sudahAdaAlamatDipilih = updatedAlamat.some((addr) => addr.alamatDipilih);
      
      // Jika belum ada, atur default: jika hanya satu alamat, set true; jika lebih dari satu, set alamat pertama saja yang true.
      if (!sudahAdaAlamatDipilih) {
        if (updatedAlamat.length === 1) {
          updatedAlamat = updatedAlamat.map((addr) => ({ ...addr, alamatDipilih: true }));
        } else if (updatedAlamat.length > 1) {
          updatedAlamat = updatedAlamat.map((addr, index) => ({ ...addr, alamatDipilih: index === 0 }));
        }
      }
      
      setUser({ ...currentUser, alamat: updatedAlamat });
      setSelectedAddress(updatedAlamat.find((addr) => addr.alamatDipilih) || null);
    }
  }, []);
  
  const handleAddressChange = (id: number) => {
    if (!user) return;
    const updatedAlamat = user.alamat.map((addr) => ({
      ...addr,
      alamatDipilih: addr.id === id,
    }));
    const updatedUser = { ...user, alamat: updatedAlamat };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setSelectedAddress(updatedAlamat.find((addr) => addr.alamatDipilih) || null);
    setIsModalOpen(false);
  };
  
  const handleAddAddress = (values: any) => {
    if (!user) return;
    const newAddrObj: Address = {
      id: Date.now(),
      label: values.label,
      provinsi: values.provinsi,
      kabupaten: values.kabupaten, // Field ini menampung data Kabupaten/Kota
      detail: values.detail,
      kodePos: values.kodePos,
      alamatDipilih: false, // Tidak langsung dipilih
    };
    const updatedUser: User = {
      ...user,
      alamat: [...user.alamat, newAddrObj],
    };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    notification.success({ message: "Selamat!", description: "Alamat baru berhasil ditambahkan" });
    form.resetFields();
    setShowNewAddressForm(false);
  };
  
  return (
    <div className="mb-4 p-4 border rounded shadow">
    <h3 className="font-semibold text-lg flex items-center gap-2 text-[#7f0353]">
    <EnvironmentOutlined /> Alamat Pengiriman
    </h3>
    
    {selectedAddress && (
      <div className="grid grid-cols-[auto,1fr,auto] gap-8 items-center justify-center border-b p-3 w-full">
      <span className="font-bold">
      {user?.nama} ({user?.telepon})
      </span>
      <span className="text-gray-700">{formatAddress(selectedAddress)}</span>
      <Button
      type="primary"
      className="bg-[#7f0353] flex items-center h-[30px]"
      onClick={() => setIsModalOpen(true)}
      >
      Ubah
      </Button>
      </div>
    )}
    
    {/* Modal Pilih Alamat */}
    
    
    <Modal
    title={
      <div className="mb-5">
      <span className="text-[#7f0353] font-bold text-lg">
      Pilih Alamat
      </span>
      <p className="text-sm mt-2">Pilih alamat pengiriman Anda</p>
      </div>
    }
    open={isModalOpen}
    onCancel={() => {
      setIsModalOpen(false);
      setShowNewAddressForm(false);
    }}
    bodyStyle={{
      maxHeight: "50vh",
      overflowY: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
    footer={[
      <Button
      key="ok"
      type="primary"
      onClick={() => {
        if (selectedAddress) {
          handleAddressChange(selectedAddress.id); // Pastikan alamat dipilih
        } else {
          notification.error({ message: "Kesalahan", description: "Pilih alamat terlebih dahulu!" });
        }
      }}
      style={{ backgroundColor: "#7f0353", borderColor: "#7f0353" }}
      >
      Konfirmasi
      </Button>,
    ]}
    >
    <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
    <Radio.Group
    className="w-full"
    onChange={(e) => {
      const selectedAddr = user?.alamat.find((addr) => addr.id === e.target.value);
      setSelectedAddress(selectedAddr || null);
    }}
    value={selectedAddress?.id}
    >
    {user?.alamat.map((addr) => (
    <div key={addr.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-100 w-full">
      <Radio value={addr.id} className="flex-1">{formatAddress(addr)}</Radio>
      <Button className="border border-gray-400 text-gray-700" onClick={
        () => {handleEditAddress(addr); setShowNewAddressForm(false);
      }}>
        Edit
      </Button>
    </div>
  ))}
    </Radio.Group>
    
    {showNewAddressForm && (
      <div className="mt-4">
      <h4 className="font-semibold mb-2">Tambah Alamat Baru</h4>
      <Form layout="vertical" form={form} onFinish={handleAddAddress}>
      <Form.Item name="provinsi" label="Provinsi" rules={[{ required: true, message: "Provinsi wajib diisi" }]}>
      <Input placeholder="Masukkan Provinsi" />
      </Form.Item>
      <Form.Item name="kabupaten" label="Kabupaten/Kota" rules={[{ required: true, message: "Kabupaten/Kota wajib diisi" }]}>
      <Input placeholder="Masukkan Kabupaten/Kota" />
      </Form.Item>
      <Form.Item name="detail" label="Alamat Detail" rules={[{ required: true, message: "Alamat detail wajib diisi" }]}>
      <Input.TextArea placeholder="Masukkan Detail Alamat" rows={3} />
      </Form.Item>
      <Form.Item name="kodePos" label="Kode Pos" rules={[{ required: true, message: "Kode pos wajib diisi" }]}>
      <Input placeholder="Masukkan Kode Pos" />
      </Form.Item>
      <Form.Item
      name="label"
      label="Tandai sebagai"
      rules={[{ required: true, message: "Pilih jenis alamat" }]}
      >
      <Radio.Group>
      <Radio value="Rumah">Rumah</Radio>
      <Radio value="Kantor">Kantor</Radio>
      </Radio.Group>
      </Form.Item>
      <div className="flex gap-2">
      <Button onClick={() => setShowNewAddressForm(false)} className="bg-gray-300 text-black w-full">
      Batal Tambah Alamat
      </Button>
      <Button type="primary" htmlType="submit" className="bg-[#7f0353] text-white w-full">
      Tambah Alamat
      </Button>
      </div>
      </Form>
      </div>
    )}
    </div>
    
    {!showNewAddressForm && (
      <div className="mt-4">
     <Button
        onClick={() => {
          setShowNewAddressForm(true);
          form.resetFields();
        }}
        className="bg-[#7f0353] text-white w-full"
      >
        Tambah Alamat Baru
      </Button>
      </div>
    )}
    </Modal>
    <Modal
  title="Edit Alamat"
  open={isEditModalOpen}
  onCancel={() => setIsEditModalOpen(false)}
  footer={null}
  bodyStyle={{
    maxHeight: "50vh", // Batasi tinggi modal agar tidak terlalu besar
    overflowY: "hidden", // Sembunyikan overflow dari modal utama
    display: "flex",
    flexDirection: "column",
  }}
>
  {/* Wrapper dengan overflow auto agar scrollbar hanya muncul di dalam */}
  <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
    <Form layout="vertical" form={form} onFinish={handleSaveEditAddress}>
      <Form.Item name="label" label="Tandai sebagai" rules={[{ required: true, message: "Pilih jenis alamat" }]}>
        <Radio.Group>
          <Radio value="Rumah">Rumah</Radio>
          <Radio value="Kantor">Kantor</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="provinsi" label="Provinsi" rules={[{ required: true, message: "Provinsi wajib diisi" }]}>
        <Input placeholder="Masukkan Provinsi" />
      </Form.Item>

      <Form.Item name="kabupaten" label="Kabupaten/Kota" rules={[{ required: true, message: "Kabupaten/Kota wajib diisi" }]}>
        <Input placeholder="Masukkan Kabupaten/Kota" />
      </Form.Item>

      <Form.Item name="detail" label="Alamat Detail" rules={[{ required: true, message: "Alamat detail wajib diisi" }]}>
        <Input.TextArea placeholder="Masukkan Detail Alamat" rows={3} />
      </Form.Item>

      <Form.Item name="kodePos" label="Kode Pos" rules={[{ required: true, message: "Kode pos wajib diisi" }]}>
        <Input placeholder="Masukkan Kode Pos" />
      </Form.Item>

      <div className="flex gap-2">
        <Button onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 text-black w-full">
          Batal
        </Button>
        <Button type="primary" htmlType="submit" className="bg-[#7f0353] text-white w-full">
          Simpan Perubahan
        </Button>
      </div>
    </Form>
  </div>
</Modal>

    
    
    </div>
  );
};

export default AddressPanel;
