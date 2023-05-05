import { Template } from "@prisma/client";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PromptBar from "~/components/PromptBar";
import { serverAPI } from "~/services/router.server";

let logMessage = "Functions Intialized";

export const loader: LoaderFunction = async ({ params }) => {
  const { kra } = params;

  const loadTemplate: {} | Template | null = !kra
    ? {}
    : await serverAPI.getSingleTemplate({
        templateID: kra,
      });

  return json({
    loadTemplate,
  });
};

export default function KRAPage() {
  const { loadTemplate }: { loadTemplate: Template } =
    useLoaderData<typeof loader>();
  return (
    <>
      <main className="w-full flex flex-col justify-between h-screen">
        <div className="m-12 flex flex-col">
          <div className="flex items-center justify-between mx-2">
            <div className="flex items-center">
              <div className="w-[5px] h-[5px] bg-green-500 rounded-full mr-3"></div>
              <p className="text-sm text-stone-500">{loadTemplate.ID}</p>
            </div>
            <p className="text-sm text-stone-500">{loadTemplate.Name}</p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-5 mt-5">
            <Row />
          </div>
        </div>
        <PromptBar actionRoute="?index" logMessage={logMessage} />
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
          <p>Behavioural</p>
          <p className="flex justify-center items-center">
            <div className="w-[5px] h-[5px] bg-green-500 rounded-full mr-3"></div>
            Grope IT Niggas
          </p>
        </div>
        <div className="mt-8">
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
