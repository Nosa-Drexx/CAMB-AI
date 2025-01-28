import Image from "next/image";

const TopNav = () => {
  return (
    <section className="w-full flex items-center p-[16px] max-w-[1700px] mx-auto">
      <Image
        src={"/assets/logo/app-logo.jpg"}
        className="object-cover rounded-md"
        width={60}
        height={60}
        alt={"app-logo"}
      />
      <h1 className="w-fit mx-auto font-bold text-2xl">Mix Track</h1>
    </section>
  );
};

export default TopNav;
