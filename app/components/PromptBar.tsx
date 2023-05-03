import { useFetcher } from "@remix-run/react";

export default function PromptBar({ actionRoute }: { actionRoute: string }) {
  const dataFetcher = useFetcher();
  return (
    <dataFetcher.Form
      className="m-12 flex mb-5"
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
  );
}
