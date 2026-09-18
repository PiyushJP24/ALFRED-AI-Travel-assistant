import { useState } from "react";
import { Wand2, UserRound, Phone } from "lucide-react";

const inputCls =
  "w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#005B9B] focus:ring-2 focus:ring-[#005B9B]/15 transition-all";

export default function BookingForm({ step, onSubmit }) {
  const [gender, setGender] = useState("Female");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("98450-12345");
  const [email, setEmail] = useState("nancy.tanwar@gmail.com");
  const [error, setError] = useState("");

  if (step === "traveller") {
    const submit = () => {
      if (!name.trim() || !age.trim()) {
        setError("Please fill in your name and age.");
        return;
      }
      onSubmit({ gender, name: name.trim(), age: age.trim() });
    };
    return (
      <div
        data-testid="booking-traveller-form"
        className="w-[280px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
      >
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <UserRound className="w-3.5 h-3.5" /> Traveller Details
        </p>
        <div className="flex gap-1.5">
          {["Female", "Male", "Other"].map((g) => (
            <button
              key={g}
              data-testid={`booking-gender-${g.toLowerCase()}`}
              onClick={() => setGender(g)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                gender === g
                  ? "bg-[#005B9B] text-white border-[#005B9B]"
                  : "bg-white text-slate-600 border-slate-300 hover:border-[#005B9B]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <input
          data-testid="booking-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className={inputCls}
        />
        <input
          data-testid="booking-age-input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          inputMode="numeric"
          className={inputCls}
        />
        {error && (
          <p data-testid="booking-form-error" className="text-xs font-medium text-rose-500">
            {error}
          </p>
        )}
        <button
          data-testid="booking-traveller-submit"
          onClick={submit}
          className="w-full bg-[#005B9B] hover:bg-[#004C8F] text-white text-sm font-bold py-2 rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  const submit = () => {
    if (!phone.trim() || !email.trim()) {
      setError("Please fill in phone and email.");
      return;
    }
    onSubmit({ phone: phone.trim(), email: email.trim() });
  };
  return (
    <div
      data-testid="booking-contact-form"
      className="w-[280px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
    >
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Phone className="w-3.5 h-3.5" /> Contact Details
      </p>
      <p
        data-testid="booking-autofill-note"
        className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5"
      >
        <Wand2 className="w-3 h-3 shrink-0" />
        Autofilled from your EaseMyTrip profile — edit if needed
      </p>
      <input
        data-testid="booking-phone-input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        inputMode="tel"
        className={inputCls}
      />
      <input
        data-testid="booking-email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        inputMode="email"
        className={inputCls}
      />
      {error && (
        <p data-testid="booking-contact-error" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
      <button
        data-testid="booking-contact-submit"
        onClick={submit}
        className="w-full bg-[#005B9B] hover:bg-[#004C8F] text-white text-sm font-bold py-2 rounded-xl transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
