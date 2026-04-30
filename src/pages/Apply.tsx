import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLocalizedServices } from "@/data/services";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Calendar as CalendarIcon, User, CreditCard, CheckCircle, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  getAvailableDates,
  getAvailableSlotsForDate,
  addBooking,
  type TimeSlot,
  type Booking,
  type NewBookingInput,
} from "@/lib/availability-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/hooks/use-locale";

const DEPOSIT_PERCENTAGE = 30;

const steps = [
  { id: 1, label: "Date & Time", icon: CalendarIcon },
  { id: 2, label: "Your Details", icon: User },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirmed", icon: CheckCircle },
];

const Apply = () => {
  const locale = useLocale();
  const services = getLocalizedServices(locale);
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const selectedService = services.find((s) => s.id === serviceId);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("full");
  const [paymentForm, setPaymentForm] = useState({
    platform: "pay-link",
    billingName: "",
    billingCountry: "",
    acceptedTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const loadAvailableDates = async () => {
      try {
        setAvailableDates(await getAvailableDates());
      } catch {
        toast.error("Unable to load available dates.");
      }
    };
    void loadAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const loadSlots = async () => {
        try {
          setAvailableSlots(await getAvailableSlotsForDate(dateStr));
          setSelectedSlot(null);
        } catch {
          toast.error("Unable to load available time slots.");
        }
      };
      void loadSlots();
    }
  }, [selectedDate]);

  const parsePrice = (price?: string): number => {
    if (!price) return 0;
    return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const fullPrice = parsePrice(selectedService?.price);
  const depositAmount = Math.round(fullPrice * (DEPOSIT_PERCENTAGE / 100));
  const amountToPay = paymentType === "deposit" ? depositAmount : fullPrice;

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availableDates.includes(dateStr);
  };

  const t = locale === "bg"
    ? {
        steps: ["Дата и Час", "Вашите Данни", "Плащане", "Потвърдено"],
        bookSession: "Резервирай Сесия",
        selectDate: "Изберете дата",
        noDates: "В момента няма свободни дати. Моля, опитайте по-късно.",
        availableTimes: "Свободни часове",
        noSlots: "Няма свободни часове за тази дата.",
        yourDetails: "Вашите Данни",
        fullName: "Име и Фамилия",
        email: "Имейл Адрес",
        phone: "Телефон",
        payment: "Плащане",
        service: "Услуга",
        dateTime: "Дата и Час",
        fullPayment: "Пълно плащане",
        deposit: "Депозит",
        remaining: "(остатъкът се доплаща преди сесията)",
        amountDue: "Сума за плащане сега",
        paymentDetails: "Данни за Плащане (Задължителни)",
        platform: "Платформа за плащане",
        billingName: "Име за фактура",
        billingCountry: "Държава за фактура",
        terms: "Потвърждавам, че данните за плащане и резервация са коректни.",
        paymentAfter: "Плащането се извършва чрез избраната от вас платежна връзка след потвърждение.",
        confirmed: "Резервацията е Потвърдена",
        date: "Дата",
        time: "Час",
        confirmationEmail: "Имейл потвърждение ще бъде изпратено до",
        back: "НАЗАД",
        continue: "ПРОДЪЛЖИ",
        confirmBooking: "ПОТВЪРДИ РЕЗЕРВАЦИЯТА",
        processing: "ОБРАБОТВАМЕ...",
        selectDateError: "Моля, изберете дата и час.",
        fillFieldsError: "Моля, попълнете всички полета.",
        paymentFieldsError: "Моля, попълнете всички задължителни полета за плащане.",
        bookingConfirmed: "Резервацията е потвърдена!",
        bookingFailed: "Неуспешно потвърждение. Моля, опитайте с друг свободен час.",
      }
    : {
        steps: ["Date & Time", "Your Details", "Payment", "Confirmed"],
        bookSession: "Book a Session",
        selectDate: "Select a Date",
        noDates: "No available dates at the moment. Please check back later.",
        availableTimes: "Available Times",
        noSlots: "No available slots for this date.",
        yourDetails: "Your Details",
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        payment: "Payment",
        service: "Service",
        dateTime: "Date & Time",
        fullPayment: "Full Payment",
        deposit: "Deposit",
        remaining: "(remaining due before session)",
        amountDue: "Amount Due Now",
        paymentDetails: "Payment Details (Required)",
        platform: "Payment Platform",
        billingName: "Billing Full Name",
        billingCountry: "Billing Country",
        terms: "I confirm my payment and booking details are correct.",
        paymentAfter: "Payment is completed through your selected platform link after booking confirmation.",
        confirmed: "Booking Confirmed",
        date: "Date",
        time: "Time",
        confirmationEmail: "A confirmation email will be sent to",
        back: "BACK",
        continue: "CONTINUE",
        confirmBooking: "CONFIRM BOOKING",
        processing: "PROCESSING...",
        selectDateError: "Please select a date and time slot.",
        fillFieldsError: "Please fill in all fields.",
        paymentFieldsError: "Please complete all required payment fields.",
        bookingConfirmed: "Booking confirmed!",
        bookingFailed: "Unable to confirm booking. Please try a different time slot.",
      };

  const localizedSteps = steps.map((stepItem, index) => ({ ...stepItem, label: t.steps[index] ?? stepItem.label }));

  const handleNext = () => {
    if (step === 1 && (!selectedDate || !selectedSlot)) {
      toast.error(t.selectDateError);
      return;
    }
    if (step === 2 && (!form.name || !form.email || !form.phone)) {
      toast.error(t.fillFieldsError);
      return;
    }
    if (
      step === 3 &&
      (!paymentForm.platform || !paymentForm.billingName || !paymentForm.billingCountry || !paymentForm.acceptedTerms)
    ) {
      toast.error(t.paymentFieldsError);
      return;
    }
    if (step === 3) {
      handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !selectedService) return;
    setSubmitting(true);

    const newBooking: NewBookingInput = {
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlot: selectedSlot,
      paymentType,
      amountPaid: amountToPay,
    };

    try {
      const result = await addBooking(newBooking);
      setBooking(result.booking as Booking);
      setStep(4);
      toast.success(t.bookingConfirmed);
    } catch {
      toast.error(t.bookingFailed);
    } finally {
      setSubmitting(false);
    }
  };

  // If it's an "apply" service (no price), show the old form
  if (selectedService?.isApply || !selectedService) {
    return <ApplyForm selectedService={selectedService} />;
  }

  const inputClasses =
    "w-full bg-white border border-primary/25 px-5 py-4 text-base font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-all duration-300 rounded-md";

  return (
    <main className="pt-20">
      <section className="py-16 md:py-24 relative ">
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-3">{t.bookSession}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
              <span className="text-gold-gradient">{selectedService.title}</span>
            </h1>
            <p className="text-gold-gradient font-body text-lg font-bold">{selectedService.price}</p>
          </motion.div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1 mb-10">
            {localizedSteps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                    step >= s.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <span className={`ml-2 text-xs font-body hidden sm:block ${step >= s.id ? "text-accent" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > s.id ? "bg-primary" : "bg-border/50"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-4">{t.selectDate}</h2>
                  <div className="bg-white border border-primary/25 p-5 rounded-md inline-block">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || !isDateAvailable(date)}
                      className="pointer-events-auto"
                      modifiers={{ available: (date) => isDateAvailable(date) }}
                      modifiersClassNames={{ available: "!bg-accent/20 !text-primary font-bold" }}
                    />
                  </div>
                  {availableDates.length === 0 && (
                    <p className="text-muted-foreground/60 text-sm mt-3 font-body">
                      {t.noDates}
                    </p>
                  )}
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="font-serif text-xl text-foreground mb-4">
                      {t.availableTimes} — {format(selectedDate, "MMMM d, yyyy")}
                    </h2>
                    {availableSlots.length === 0 ? (
                      <p className="text-muted-foreground/60 text-sm font-body">{t.noSlots}</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-4 py-3.5 text-base font-body border rounded-md transition-all duration-200 ${
                              selectedSlot?.id === slot.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-primary/20 bg-white text-foreground hover:border-primary/40"
                            }`}
                          >
                            {slot.startTime} – {slot.endTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="font-serif text-xl text-foreground mb-4">{t.yourDetails}</h2>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">{t.fullName}</label>
                  <input type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">{t.email}</label>
                  <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">{t.phone}</label>
                  <input type="tel" required maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="font-serif text-xl text-foreground mb-4">{t.payment}</h2>
                
                <div className="bg-card border border-border p-6 space-y-4">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.service}</span>
                    <span className="text-foreground">{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.dateTime}</span>
                    <span className="text-foreground">
                      {selectedDate && format(selectedDate, "MMM d, yyyy")} · {selectedSlot?.startTime}–{selectedSlot?.endTime}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as "deposit" | "full")} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="text-sm font-body text-foreground cursor-pointer">
                          {t.fullPayment} — €{fullPrice.toLocaleString()}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="deposit" id="deposit" />
                        <Label htmlFor="deposit" className="text-sm font-body text-foreground cursor-pointer">
                          {t.deposit} ({DEPOSIT_PERCENTAGE}%) — €{depositAmount.toLocaleString()}
                          <span className="text-muted-foreground ml-1 text-xs">{t.remaining}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-body">
                    <span className="text-primary font-bold">{t.amountDue}</span>
                    <span className="text-primary font-bold text-lg">€{amountToPay.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white border border-primary/25 rounded-md p-6 space-y-4">
                  <h3 className="font-serif text-lg text-foreground">{t.paymentDetails}</h3>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-2 block">
                      {t.platform}
                    </label>
                    <select
                      value={paymentForm.platform}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, platform: e.target.value }))}
                      className={inputClasses}
                    >
                      <option value="pay-link">Pay with Link</option>
                      <option value="stripe">Stripe</option>
                      <option value="bank-transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-2 block">
                      {t.billingName}
                    </label>
                    <input
                      value={paymentForm.billingName}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, billingName: e.target.value }))}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-2 block">
                      {t.billingCountry}
                    </label>
                    <input
                      value={paymentForm.billingCountry}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, billingCountry: e.target.value }))}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <label className="flex items-center gap-3 text-sm font-body text-foreground">
                    <input
                      type="checkbox"
                      checked={paymentForm.acceptedTerms}
                      onChange={(e) => setPaymentForm((prev) => ({ ...prev, acceptedTerms: e.target.checked }))}
                    />
                    {t.terms}
                  </label>
                </div>

                <p className="text-xs text-muted-foreground/50 font-body">
                  {t.paymentAfter}
                </p>
              </motion.div>
            )}

            {step === 4 && booking && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{t.confirmed}</h2>
                <div className="bg-card border border-border p-6 text-left space-y-3 max-w-md mx-auto">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.service}</span>
                    <span className="text-foreground">{booking.serviceName}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.date}</span>
                    <span className="text-foreground">{booking.date}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.time}</span>
                    <span className="text-foreground">{booking.timeSlot.startTime} – {booking.timeSlot.endTime}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t.payment}</span>
                    <span className="text-foreground">{booking.paymentType === "deposit" ? `Deposit (${DEPOSIT_PERCENTAGE}%)` : "Full"} — €{booking.amountPaid.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-muted-foreground/70 font-body text-sm">
                  {t.confirmationEmail} <span className="text-accent">{booking.clientEmail}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <Button variant="goldOutline" size="lg" onClick={() => setStep((s) => s - 1)} className="group">
                  <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  {t.back}
                </Button>
              )}
              <Button
                variant="gold"
                size="lg"
                onClick={handleNext}
                disabled={submitting}
                className="flex-1  group"
              >
                {submitting ? t.processing : step === 3 ? t.confirmBooking : t.continue}
                {!submitting && <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

/* Fallback form for "Other Advisory" / no service */
const ApplyForm = ({ selectedService }: { selectedService?: typeof services[0] }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Your inquiry has been received. We'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  const inputClasses =
    "w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/40 focus:bg-card transition-all duration-300";

  return (
    <main className="pt-20">
      <section className="py-24 md:py-32 relative ">
        <div className="container max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4">Get Started</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              {selectedService ? (
                <>Book: <span className="text-gold-gradient">{selectedService.title}</span></>
              ) : (
                <>Apply / <span className="text-gold-gradient">Book</span></>
              )}
            </h1>
            <p className="text-muted-foreground/80 font-body mb-12">
              {selectedService
                ? "Complete the form below and we'll send you a booking confirmation."
                : "Tell us about your advisory needs. We review every application personally."}
            </p>
          </motion.div>
          <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">Full Name</label>
              <input type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">Email Address</label>
              <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3 block">Message</label>
              <textarea required maxLength={1000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClasses} resize-none`} />
            </div>
            <Button variant="gold" size="lg" type="submit" disabled={submitting} className="w-full  group">
              {submitting ? "SENDING..." : (
                <>
                  SUBMIT APPLICATION
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

export default Apply;
