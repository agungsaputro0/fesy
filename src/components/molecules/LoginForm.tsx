import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { notification, Spin, Modal, Button as AntButton } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { handleLogin } from "../hooks/HandleLogin";
import { useDispatch } from 'react-redux'; 
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";

const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const accountList = [
  { email: "budi@example.com", password: "budiROX" },
  { email: "siti@example.com", password: "sitiROX" },
  { email: "ahmad@example.com", password: "ahmadROX" },
  { email: "dewi@example.com", password: "dewiROX" },
  { email: "rizky@example.com", password: "rizkyROX" },
  { email: "lina@example.com", password: "linaROX" },
  { email: "rina@example.com", password: "rinaROX" },
  { email: "yoga@example.com", password: "yogaROX" },
];

const LoginForm: FC = () => {
  const [loginFailed, setLoginFailed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showInformationModal = () => {
    setIsInformationModalOpen(true);
  };

  const handleInformationOk = () => {
    setIsInformationModalOpen(false);
  };

  const handleInformationCancel = () => {
    setIsInformationModalOpen(false);
  };

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (loginFailed) {
      timer = setTimeout(() => {
        setLoginFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [loginFailed]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginStart());
    setLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
        const user = await handleLogin(email, password); 
        const userKategori = user.user?.role;
        dispatch(loginSuccess(email));
        if(user.success === true){
          notification.success({
            message: "Login Berhasil!",
            description: "Selamat, Anda berhasil Login!",
          });
          setTimeout(() => {
            window.location.href = userKategori === 1 ? '/' : '/'; 
          }, 1000); 
        } else {
          notification.error({
            message: "Login Gagal!",
            description: "Mohon maaf, Kredensial Anda tidak valid!",
          });
        }
    } catch (error) {
        setLoginFailed("Invalid credentials");
        dispatch(loginFailure());
        notification.error({
            message: "Login Gagal!",
            description: "Mohon maaf, Kredensial Anda tidak valid!",
        });
    } finally {
        setLoading(false);
    }
  };

  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'blue' }} spin />;

  return (
  <section>
  <Helmet>
    <title>{appName}</title>
  </Helmet>
  <div className="pt-24 sm:pt-24 sm:mb-20 md:pt-6 lg:pt-6 flex flex-col lg:flex-row justify-between items-center min-h-screen px-4 md:px-8">
    <div className="sm:pl-0 md:pl-0 lg:pl-10 pt-2 sm:pt-2 md:pt-16 lg:pt-6 mr-0 lg:mr-24 md:mr-0 sm:mr-0 text-center lg:text-left mb-8 lg:mb-0">
      <h1 className="text-6xl font-bold text-[#7f0353]">FESY</h1>
      <h3 className="text-l text-[#5c595f]">E-commerce for your <b>pre-loved</b> clothes</h3>
    </div>

    {/* Bagian Kanan: Panel Login */}
    <div className="flex flex-col md:flex-row bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl min-w-[300px]">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center pb-[30px]">Login</h1>
        <form onSubmit={handleSubmit}>
          <InputElement
            inputClass="mb-6"
            forwhat="email"
            labelMessage="Email"
            typeInput="text"
            inputName="email"
            inputPlaceholder="example@example.com"
            ref={usernameRef}
          />
          <InputElement
            inputClass="mb-4"
            forwhat="password"
            labelMessage="Password"
            typeInput="password"
            inputName="password"
            inputPlaceholder="****"
          />
          <Button
            type="submit"
            variant="bg-[#7f0353] w-full hover:bg-green-900 mt-4"
            message="Login"
            disabled={loading}
          />
        </form>
        <p className="text-slate-500 mt-4 text-center">Untuk Akun Login, silakan&nbsp;
          <Link onClick={() => showModal()} to="#" className="text-[#7f0353]">
          <b>Klik Disini</b>
          </Link>
        </p>
        <p className="text-slate-500 mt-2 text-center">Mohon baca Informasi berikut&nbsp;
          <Link onClick={() => showInformationModal()} to="#" className="text-[#7f0353]">
          <b>Klik Disini</b>
          </Link>
        </p>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {loginFailed && (
          <p className="text-red-500 mt-4 text-center">{loginFailed}</p>
        )}
      </div>
      <Modal
      title={
        <div className="flex items-center gap-2 text-[#7f0353] pb-2 border-b">
          <CheckCircleOutlined className="text-lg" /> Petunjuk Akun Login
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <AntButton className="bg-[#7f0353] text-white hover:bg-[#5a023b]" key="ok" type="primary" onClick={handleOk}>
          Mengerti
        </AntButton>
      ]}
    >
      <p className="mb-2">Gunakan akun berikut untuk login utama :</p>
      <div className="bg-gray-100 p-3 rounded-lg text-sm">
        <p><b>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> fajar@example.com</p>
        <p><b>Password&nbsp;&nbsp;:</b> fajaROX</p>
      </div>
      <p className="mt-4 text-gray-800">Setelah login dengan akun tersebut, Anda dapat mengakses fitur lengkap kami.</p>
      <p className="mt-4 text-gray-800">Khusus akun ini, akan memiliki data dummy untuk semua tingkat transaksi pembelian</p>
      <p className="mt-4 text-gray-800">Untuk simulasi proses bisnis langsung dapat dilakukan dengan akun manapun</p>
    </Modal>
    <Modal
      title={
        <div className="flex items-center gap-2 text-[#7f0353] pb-2 border-b">
          <CheckCircleOutlined className="text-lg" /> Informasi terkait dengan Karya Kami
        </div>
      }
      open={isInformationModalOpen}
      onOk={handleInformationOk}
      onCancel={handleInformationCancel}
      footer={[
        <AntButton
          className="bg-[#7f0353] text-white hover:bg-[#5a023b]"
          key="ok"
          type="primary"
          onClick={handleInformationOk}
        >
          Mengerti
        </AntButton>,
      ]}
    >
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <p className="mb-2">
          Fesy dibangun dengan menggunakan stack utama berupa bahasa pemrograman TypeScript & JavaScript menggunakan library React JS.
        </p>
        <p className="mt-4 text-gray-800">Ada 15 halaman yang nantinya akan dapat diakses.</p>
        <p className="mt-4 text-gray-800">Berikut adalah daftar Akun non-utama yang dapat digunakan untuk Login:</p>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {accountList.map((account, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 rounded-lg text-sm transition-all hover:bg-gray-200 cursor-pointer"
            >
              <p><b>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {account.email}</p>
              <p><b>Password&nbsp;&nbsp;:</b> {account.password}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>

      {/* Bagian Gambar */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="/assets/img/login-boy.png"
          alt="Login illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</section>

  );
};

export default LoginForm;
