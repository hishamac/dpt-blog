export default function Page() {
  return (
    <>
      <nav
        className="bg-white border-gray-200 dark:bg-gray-900 mx-[20%]  md:visible"
        dir="rtl"
      >
        <div className="flex m-2">
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
            alt="Logo"
            className="w-20 h-20"
          />
          <h1 className="my-auto text-2xl font-extrabold">لوجو لوجو</h1>
          <ul className="flex m-auto mr-auto">
            <li className="mx-4 font-bold">الرَئيسيّة</li>
            <li className="mx-4 font-bold">عن القسم</li>
            <li className="mx-4 font-bold">نشاطات</li>
            <li className="mx-4 font-bold">الجداول الالكترونية</li>
            <li className="mx-4 font-bold">اتصل بنا</li>
          </ul>
        </div>
      </nav>
      <nav
        className="bg-white border-gray-200 dark:bg-gray-900 visible md:hidden"
        dir="rtl"
      >
        <div className="flex flex-col">
          <div className="flex mx-auto">
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
            alt="Logo"
            className="w-16 h-16"
          />
          <h1 className="my-auto text-xl font-extrabold">لوجو لوجو</h1>
          </div>
          <ul className="flex m-auto mr-auto">
            <li className="mx-1 text-xs font-bold">الرَئيسيّة</li>
            <li className="mx-1 text-xs font-bold">عن القسم</li>
            <li className="mx-1 text-xs font-bold">نشاطات</li>
            <li className="mx-1 text-xs font-bold">الجداول الالكترونية</li>
            <li className="mx-1 text-xs font-bold">اتصل بنا</li>
          </ul>
        </div>
      </nav>
    </>
  );
}
