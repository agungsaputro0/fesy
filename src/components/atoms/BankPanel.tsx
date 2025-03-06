import bankList from "../../pseudo-db/bank.json"; // Pastikan path benar

type PaymentPanelProps = {
  selectedPayment: string | null;
  setSelectedPayment: React.Dispatch<React.SetStateAction<string | null>>;
};

const PaymentPanel: React.FC<PaymentPanelProps> = ({ setSelectedPayment }) => {

  // Mencari data bank yang dipilih
 

  return (
    <div className="mt-8 p-6 border border-gray-300 rounded-lg shadow-md mb-10">
      <h2 className="font-bold text-lg mb-4">Pilih Metode Pembayaran</h2>

      {/* Opsi Transfer Bank */}
      <div className="space-y-3">
        {bankList.map((bank) => (
          <label
            key={bank.id}
            className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-100"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={bank.name}
              className="w-5 h-5"
              onChange={() => setSelectedPayment(bank.name)}
            />
            <img src={bank.logo} alt={bank.name} className="w-10 h-10 rounded object-contain" />
            <span className="text-md font-bold">{bank.name}</span>
          </label>
        ))}
      </div>

    </div>
  );
};

export default PaymentPanel;
