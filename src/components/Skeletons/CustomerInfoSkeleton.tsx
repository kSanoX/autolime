import ContentLoader from "react-content-loader";

export default function CustomerInfoSkeleton() {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={160}
      viewBox="0 0 400 160"
      backgroundColor="#d9d9d9"
      foregroundColor="#ededed"
    >
      {/* Заголовок */}
      <rect x="0" y="10" rx="4" ry="4" width="180" height="24" />

      {/* Телефон */}
      <rect x="0" y="50" rx="4" ry="4" width="100" height="16" /> {/* label */}
      <rect x="0" y="70" rx="4" ry="4" width="200" height="20" /> {/* phone */}
      <rect x="220" y="70" rx="4" ry="4" width="24" height="24" /> {/* edit icon */}

      {/* Email */}
      <rect x="0" y="110" rx="4" ry="4" width="100" height="16" /> {/* label */}
      <rect x="0" y="130" rx="4" ry="4" width="250" height="20" /> {/* email */}
      <rect x="270" y="130" rx="4" ry="4" width="24" height="24" /> {/* edit icon */}
    </ContentLoader>
  );
}
