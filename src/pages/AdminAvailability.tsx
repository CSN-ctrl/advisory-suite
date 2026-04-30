import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Trash2, Lock, CalendarDays, Clock, Users } from "lucide-react";
import {
  getAvailability,
  getAvailabilityForDate,
  addSlotToDate,
  removeSlotFromDate,
  getBookings,
  type TimeSlot,
  type Booking,
} from "@/lib/availability-store";
import { useAdmin } from "@/contexts/AdminContext";

const AdminAvailability = () => {
  const { isAdminAuthenticated, setAdminAuthenticated } = useAdmin();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("10:00");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"calendar" | "bookings">("calendar");
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const verifyAdminSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/me", {
        method: "GET",
        credentials: "include",
      });
      setAdminAuthenticated(response.ok);
    } catch {
      setAdminAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [setAdminAuthenticated]);

  const refreshData = useCallback(() => {
    const allAvail = getAvailability();
    setAvailableDates(allAvail.map((d) => d.date));
    setBookings(getBookings());
    if (selectedDate) {
      setSlots(getAvailabilityForDate(format(selectedDate, "yyyy-MM-dd")));
    }
  }, [selectedDate]);

  useEffect(() => {
    void verifyAdminSession();
  }, [verifyAdminSession]);

  useEffect(() => {
    if (isAdminAuthenticated) refreshData();
  }, [isAdminAuthenticated, refreshData]);

  useEffect(() => {
    if (selectedDate && isAdminAuthenticated) {
      setSlots(getAvailabilityForDate(format(selectedDate, "yyyy-MM-dd")));
    }
  }, [selectedDate, isAdminAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        toast.error("Incorrect password.");
        return;
      }

      setAdminAuthenticated(true);
      toast.success("Welcome, Admin.");
    } catch {
      toast.error("Unable to reach admin authentication service.");
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="pt-20">
        <section className="py-32 relative ">
          <div className="container max-w-sm">
            <p className="text-sm text-muted-foreground font-body">Checking admin session...</p>
          </div>
        </section>
      </main>
    );
  }

  const handleAddSlot = () => {
    if (!selectedDate) return;
    if (newStart >= newEnd) {
      toast.error("End time must be after start time.");
      return;
    }
    const slot: TimeSlot = {
      id: crypto.randomUUID(),
      startTime: newStart,
      endTime: newEnd,
    };
    addSlotToDate(format(selectedDate, "yyyy-MM-dd"), slot);
    refreshData();
    toast.success(`Slot added: ${newStart} – ${newEnd}`);
  };

  const handleRemoveSlot = (slotId: string) => {
    if (!selectedDate) return;
    removeSlotFromDate(format(selectedDate, "yyyy-MM-dd"), slotId);
    refreshData();
    toast.success("Slot removed.");
  };

  if (!isAdminAuthenticated) {
    return (
      <main className="pt-20">
        <section className="py-32 relative ">
          <div className="container max-w-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-8">
                <Lock className="w-5 h-5 text-accent" />
                <h1 className="font-serif text-2xl text-foreground">Admin Access</h1>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/40 focus:bg-card transition-all duration-300"
                />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/40 focus:bg-card transition-all duration-300"
                />
                <Button variant="gold" size="lg" type="submit" className="w-full">
                  ENTER
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <section className="py-16 md:py-24 relative ">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-3">Admin Panel</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              <span className="text-gold-gradient">Manage Availability</span>
            </h1>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-border">
            <button
              onClick={() => setTab("calendar")}
              className={`px-4 py-3 text-sm font-body flex items-center gap-2 transition-colors border-b-2 ${
                tab === "calendar" ? "border-primary text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Availability
            </button>
            <button
              onClick={() => setTab("bookings")}
              className={`px-4 py-3 text-sm font-body flex items-center gap-2 transition-colors border-b-2 ${
                tab === "bookings" ? "border-primary text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" /> Bookings ({bookings.length})
            </button>
          </div>

          {tab === "calendar" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-card border border-border p-4 rounded-md">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="pointer-events-auto"
                  modifiers={{ hasSlots: (date) => availableDates.includes(format(date, "yyyy-MM-dd")) }}
                  modifiersClassNames={{ hasSlots: "!bg-accent/20 !text-primary font-bold" }}
                />
              </div>

              {/* Slot Management */}
              <div>
                {selectedDate ? (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>

                    {/* Add Slot */}
                    <div className="bg-card border border-border p-4 space-y-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold">Add Time Slot</p>
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground font-body mb-1 block">Start</label>
                          <input
                            type="time"
                            value={newStart}
                            onChange={(e) => setNewStart(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground font-body mb-1 block">End</label>
                          <input
                            type="time"
                            value={newEnd}
                            onChange={(e) => setNewEnd(e.target.value)}
                            className="w-full bg-card border border-border px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-accent/40"
                          />
                        </div>
                        <Button variant="gold" size="default" onClick={handleAddSlot}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Existing Slots */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Slots ({slots.length})
                      </p>
                      {slots.length === 0 ? (
                        <p className="text-sm text-muted-foreground/60 font-body">No slots configured for this date.</p>
                      ) : (
                        slots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between bg-card border border-border px-4 py-3">
                            <span className="text-sm font-body text-foreground">
                              {slot.startTime} – {slot.endTime}
                            </span>
                            <button onClick={() => handleRemoveSlot(slot.id)} className="text-destructive/70 hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/50 font-body text-sm">
                    Select a date to manage time slots
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <p className="text-muted-foreground/60 font-body text-sm py-8 text-center">No bookings yet.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="bg-card border border-border p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-sm font-body">
                    <div>
                      <span className="text-muted-foreground text-xs block">Client</span>
                      <span className="text-foreground">{b.clientName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Service</span>
                      <span className="text-foreground">{b.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Date & Time</span>
                      <span className="text-foreground">{b.date} · {b.timeSlot.startTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Payment</span>
                      <span className="text-accent">€{b.amountPaid} ({b.paymentType})</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">Status</span>
                      <span className="text-accent">{b.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminAvailability;
