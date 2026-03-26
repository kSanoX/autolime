import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SingleCalendarMobileSheet } from "@/components/Calendars/SingleCalendarDropDownSheet";
import { SexDropDown } from "@/components/ui/SexDropDown";
import CustomerContactInfo from "@/components/CustomerContactInfo";
import MyVehicles from "./MyVehicles";
import NotificationSettings from "./NotificationSettings";
import { useEditUser } from "@/hooks/useEditUser";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import { customFetch } from "@/utils/customFetch";
import { leftArrowUrl, calendarIconUrl, dangerUrl } from "@/assets/staticUrls";

export default function CustomerMyData() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.data);
  const { editUser} = useEditUser();

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSex, setSelectedSex] = useState<"male" | "female" | "">("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sexOpen, setSexOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wash, setWash] = useState(false);
const [subscription, setSubscription] = useState(true);
const [promo, setPromo] = useState(false);

  const t = useTranslation();

  const isFormFilled =
    firstName.trim() &&
    secondName.trim() &&
    selectedDate &&
    selectedSex !== "";

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setSecondName(user.lastName);
      setSelectedDate(user.dateOfBirth ?? undefined);
      setSelectedSex(user.sex ?? "");

      setWash(user.enablePushWashAppointment);
      setSubscription(user.enablePushRenewalSubscription);
      setPromo(user.enablePushSpecialPromotions);
    }
  }, [user]);

  const handleSave = async () => {
    const success = await editUser({
      name: firstName,
      surname: secondName,
      sex: selectedSex !== "" ? selectedSex : undefined,
      date_of_birth: selectedDate?.toISOString().split("T")[0],
    });
  
    try {
      const token = localStorage.getItem("access_token");
      await customFetch(`${import.meta.env.VITE_API_URL}/push_settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wash_appointment: wash,
          renewal_subscription: subscription,
          special_promotions: promo,
        }),
      });
    } catch (err) {
      console.error("Ошибка сохранения push-настроек:", err);
    }
  
    if (success) {
      setModalOpen(false);
    }
  };
  

  return (
    <div className='customer-data-container'>
      <header className='header'>
        <img
          src={leftArrowUrl}
          alt='back'
          onClick={() => navigate(-1)}
        />
        <h2>{t("CustomerMyData.header.title")}</h2>
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{ cursor: isFormFilled ? "pointer" : "default" }}
          onClick={() => isFormFilled && setModalOpen(true)}
        >
          <path
            d='M18 4V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H14L18 4ZM9 15C9.83333 15 10.5417 14.7083 11.125 14.125C11.7083 13.5417 12 12.8333 12 12C12 11.1667 11.7083 10.4583 11.125 9.875C10.5417 9.29167 9.83333 9 9 9C8.16667 9 7.45833 9.29167 6.875 9.875C6.29167 10.4583 6 11.1667 6 12C6 12.8333 6.29167 13.5417 6.875 14.125C7.45833 14.7083 8.16667 15 9 15ZM3 7H12V3H3V7Z'
            fill={isFormFilled ? "#183D69" : "#879AB1"}
          />
        </svg>
      </header>

      <div className='customer-data-wrapper'>
        <h1>{t("CustomerMyData.form.title")}</h1>
        <form className='customer-data-form'>
          {[
            {
              label: t("CustomerMyData.form.fields.firstName"),
              value: firstName,
              setter: setFirstName,
            },
            {
              label: t("CustomerMyData.form.fields.secondName"),
              value: secondName,
              setter: setSecondName,
            },
          ].map(({ label, value, setter }) => (
            <div className='form-group' key={label}>
              <label>{label}</label>
              <input
                type='text'
                placeholder={t("CustomerMyData.form.placeholders.text")}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          <div className='form-group'>
            <label>{t("CustomerMyData.form.fields.dateOfBirth")}</label>
            <div
              className='input-with-icon-customer'
              onClick={() => setCalendarOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <input
                type='text'
                placeholder={t("CustomerMyData.form.placeholders.date")}
                value={
                  selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""
                }
                readOnly
              />
              <img src={calendarIconUrl} alt='calendar' />
            </div>
          </div>

          <SingleCalendarMobileSheet
            open={calendarOpen}
            setOpen={setCalendarOpen}
            applyDate={setSelectedDate}
            initialDate={selectedDate}
            title={t("CustomerMyData.form.calendarTitle")}
          />

          <div className='form-group'>
            <label>{t("CustomerMyData.form.fields.sex")}</label>
            <div
              className='input-with-icon-customer'
              style={{ cursor: "pointer" }}
              onClick={() => setSexOpen(true)}
            >
              <input
                type='text'
                placeholder='---'
                value={
                  selectedSex
                    ? selectedSex[0].toUpperCase() + selectedSex.slice(1)
                    : ""
                }
                readOnly
              />
              <img
                className='dropdown-arrow-sex'
                src={leftArrowUrl}
                alt='select'
              />
            </div>
          </div>

          <SexDropDown
            open={sexOpen}
            setOpen={setSexOpen}
            applySex={(sex) => {
              setSelectedSex(sex);
              setSexOpen(false);
            }}
            currentSex={selectedSex}
          />
        </form>
      </div>

      {modalOpen && (
        <div className='save-data-modal-backdrop'>
          <div className='save-data-modal-window'>
            <div className='save-data-modal-cap'>
              <img src={dangerUrl} alt='danger' />
              <h4>{t("CustomerMyData.modal.title")}</h4>
            </div>
            <p>{t("CustomerMyData.modal.message")}</p>
            <div className='actions'>
              <button className='leave' onClick={() => setModalOpen(false)}>
                {t("CustomerMyData.modal.buttons.leave")}
              </button>
              <button className='save' onClick={handleSave}>
                {t("CustomerMyData.modal.buttons.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerContactInfo />
      <MyVehicles />
      <NotificationSettings
        wash={wash}
        setWash={setWash}
        subscription={subscription}
        setSubscription={setSubscription}
        promo={promo}
        setPromo={setPromo}
      />
    </div>
  );
}
