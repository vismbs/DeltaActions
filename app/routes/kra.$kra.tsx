import PromptBar from "~/components/PromptBar";

export default function KRAPage() {
  return (
    <>
      <main className="w-full flex flex-col justify-between h-screen">
        <div className="m-12 flex justify flex-wrap md:flex-nowrap gap-5">
          <Row />
        </div>
        <PromptBar actionRoute="?index" />
      </main>
    </>
  );
}

function Row() {
  return (
    <>
      <div className="w-full input_box py-4 px-4 rounded-lg text-stone-500 text-sm flex flex-col justify-between">
        <div className="flex justify-between">
          <p>K74343</p>
          <p className="flex justify-center items-center">
            <div className="w-[5px] h-[5px] bg-green-500 rounded-full mr-3"></div>
            Rape IT Niggas
          </p>
        </div>
        <hr className="mt-4"></hr>
        <div className="mt-4">
          <div className="flex justify-between mt-3 items-center">
            <p>Make sure the Chainsaw is Ready</p>
            <p>30%</p>
            <div className="w-[80px] h-[5px]">
              <p className="w-[80px] h-[5px] bg-green-500 rounded-xl"></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
