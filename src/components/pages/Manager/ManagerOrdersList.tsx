import { useAllRecords } from "@/hooks/useAllRecords";
import ManagerOrder from "../../ManagerOrder";

type Status = "New" | "Confirm" | "Deleted" | "Rescheduled" | "Expired";
type Filter = "New" | "Confirmed" | "Sheduled" | "All";

interface ManagerOrdersListProps {
    activeStatus: Filter;
    onDelete: (id: number) => void;
    onReschedule: (id: number, date: string) => void;
    onConfirm: (id: number) => void;
  }  

export default function ManagerOrdersList({
  activeStatus,
  onDelete,
  onReschedule,
  onConfirm,
}: ManagerOrdersListProps) {
  const { appointments, loading, error } = useAllRecords();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function mapApprovedToStatus(code: number): Status {
    switch (code) {
      case 0:
        return "New";
      case 1:
        return "Confirm";
      case 2:
        return "Deleted";
      case 3:
        return "Rescheduled";
      case 4:
        return "Expired";
      default:
        return "New";
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    const status = mapApprovedToStatus(a.approved);
    if (activeStatus === "All") return true;
    if (activeStatus === "Sheduled") return status === "Rescheduled";
    if (activeStatus === "Confirmed") return status === "Confirm";
    return status === activeStatus;
  });

  if (filteredAppointments.length === 0) {
    return <div className="empty-message">You haven't left any new orders</div>;
  }

  return (
    <div>
      {filteredAppointments.map((a) => (
        <ManagerOrder
        key={a.id}
        status={mapApprovedToStatus(a.approved)}
        date={`${a.date} · ${a.time.slice(0, 5)}`}
        type={a.services.map((s) => s.name).join(", ")}
        customer={{
          name: `${a.user.name} ${a.user.surname}`,
          phone: a.user.phone,
        }}
        onDelete={() => onDelete(a.id)}
        onReschedule={() => onReschedule(a.id, a.date)}
        onConfirmed={() => onConfirm(a.id)}
      />      
      ))}
    </div>
  );
}
