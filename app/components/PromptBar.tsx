import { useFetcher } from "@remix-run/react";

export default function PromptBar({
  actionRoute,
  logMessage,
}: {
  actionRoute: string;
  logMessage: string;
}) {
  const dataFetcher = useFetcher();
  return (
    <div className="m-12">
      <dataFetcher.Form
        className="flex mb-5"
        method="post"
        action={actionRoute}
      >
        <input
          type="text"
          className="w-full input_box py-3 px-4 rounded-lg text-stone-500 text-xs"
          placeholder="Enter an Action"
          name="prompt_box"
        />
        <button className="submit_button ml-5 rounded-lg text-xs px-4 text-stone-500">
          Submit
        </button>
      </dataFetcher.Form>
      <div className="flex items-center ml-2">
        <div
          className="h-[5px] w-[5px] rounded-full mr-3"
          style={{
            backgroundColor:
              logMessage === "Functions Initialized" ? "green" : "red",
          }}
        ></div>
        <p
          className="text-xs font-sans"
          style={{
            color: logMessage === "Functions Initialized" ? "green" : "red",
          }}
        >
          {logMessage}
        </p>
      </div>
    </div>
  );
}
