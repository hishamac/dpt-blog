export default function Card({ main, sub,route }) {
  return (
    <div className="flex flex-col max-w-sm min-w-[20%] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2 cursor-pointer" onClick={()=>{
      window.location.href = `/admin/${route}`
    }}>
      <p className="mb-2 text-4xl font-semibold tracking-tight text-gray-700 dark:text-gray-400 mx-auto">
        {main}
      </p>
      <p className="font-normal text-xl text-gray-700 dark:text-gray-400 mx-auto">
        {sub}
      </p>
    </div>
  );
}
