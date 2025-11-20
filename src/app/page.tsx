import LoginPage from "./(routes)/auth/login";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <LoginPage />
    </div>
  );
}
