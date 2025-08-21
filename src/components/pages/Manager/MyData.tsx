import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";

export default function MyData() {
  const user = useSelector((state: RootState) => state.user.data);
  const t = useTranslation();

  if (!user) return <div>Loading...</div>;

  return (
    <div className='my-data-container'>
      <header>{t("MyData.header")}</header>

      <div className="my-info">
        <h2>{t("MyData.info.title")}</h2>
        <div className="name-info">
          <div className="f-name">
            <p>{t("MyData.info.firstName")}</p>
            <p className='bold'>{user.firstName}</p>
          </div>
          <div className="s-name">
            <p>{t("MyData.info.lastName")}</p>
            <p className='bold'>{user.lastName}</p>
          </div>
        </div>
        <div className="phone-number">
          <p>{t("MyData.info.phone")}</p>
          <p className='bold'>{user.phone}</p>
        </div>
        <div className="type">
          <p>{t("MyData.info.role")}</p>
          <p className='bold'>Wash manager</p> {/* хардкод */}
        </div>
        <div className="branch">
          <p>{t("MyData.info.branch")}</p>
          <p className='bold'>Geocar on Shartava</p> {/* хардкод */}
          <p>57 Zhiuli Shartava St, Tbilisi</p> {/* хардкод */}
        </div>
      </div>

      <div className="my-statistic">
        <h3>{t("MyData.statistic.title")}</h3>
        <div className="statistic-button-block">
          <button className='statistic-btn'>{t("MyData.statistic.buttons.day")}</button>
          <button className='statistic-btn'>{t("MyData.statistic.buttons.week")}</button>
          <button className='statistic-btn'>{t("MyData.statistic.buttons.month")}</button>
        </div>
      </div>
    </div>
  );
}
