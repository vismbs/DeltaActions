import { Template } from "@prisma/client";
import {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
  json,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PromptBar from "~/components/PromptBar";
import { openAI } from "~/services/openai.server";
import { serverAPI } from "~/services/router.server";
import { AIMethod, methodList } from "~/utils/appDeco";

class AIFunctions {
  constructor() {
    if (!(process.env.NODE_ENV === "production"))
      console.info("Functions Initialized");
  }

  @AIMethod(
    "adds a template to the database and takes in template name, category name and a role name as arguments"
  )
  addTemplate(templateName: string, categoryName: string, roleName: string) {
    const ID = `T${Math.floor(Math.random() * 10000)}`;
    const addedTemplate = serverAPI.addTemplate({
      tempCategory: categoryName,
      tempName: templateName,
      tempRole: roleName,
      tempID: ID,
    });

    return addedTemplate;
  }

  @AIMethod("deletes a template and takes in a template id")
  deleteTemplate(templateID: string) {
    const deletedTemplate = serverAPI.deleteTemplate({
      templateID
    })

    return deletedTemplate;
  }

  @AIMethod("updates the title of a template and takes in a template title and template id")
  updateTitle(templateTitle: string, templateID: string) {
    const updatedTemplate = serverAPI.editTemplate({
      templateName: templateTitle,
      templateCategory: "",
      templateID: templateID,
      templateRole: ""
    })

    return updatedTemplate
  }
}

const UserInstance = new AIFunctions();

export const loader: LoaderFunction = async () => {
  const existingTemplates = await serverAPI.getTemplates();
  return json({
    existingTemplates,
  });
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const evalFunction = await openAI.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a program controller that decides which functions get executed based on the incoming request. You dont worry about the implementation or the output of the function. You understand the task to be executed form the request and choose which function to execute. Your response must include only the call signature of the function alone in plain text and no other prose. Do not format the result within parenthesis. The function name must not be formatted in a code block. You need not worry about the implementation or providing output of the functions. Your job is to purely choose which function to call and its parameters. Whenever you are given a prompt that doesnt not have a valid function to call, you only return NO_FUNCTION_FOUND and nothing else. These are the only two possible responses, either you give the function, or NO_FUNCTION_FOUND. You must not ever add comments in your code. This it the function list: ${JSON.stringify(
      methodList
    )}. This is the user prompt: ${formData.get("prompt_box")}`,
    temperature: 0,
    max_tokens: 300
  });

  try {
    eval(`UserInstance.${evalFunction.data.choices[0].text?.replace("\n", "")}`);
  } catch (err) {
    console.error(err);
  }

  return json({});
};

const IndexPage = () => {
  const { existingTemplates }: { existingTemplates: Template[] } =
    useLoaderData<typeof loader>();

  return (
    <>
      <main className="w-full flex flex-col justify-between h-screen">
        <div className="mt-5">
          <Table tableData={existingTemplates} />
        </div>
        <div>
          <PromptBar actionRoute="?index" />
          <p className="w-full text-center text-xs mb-5 text-stone-500 font-sans">
            DeltaActions | Delta #2
          </p>
        </div>
      </main>
    </>
  );
};

function Table({ tableData }: { tableData: Template[] }) {
  return (
    <>
      {tableData.map((tableRows) => {
        return (
          <Link to={`kra/${tableRows.ID}`} key={tableRows.ID}>
            <div
              className={`mx-12 my-2 text-center animate`}
              style={{
                animationDelay: `${Math.floor(Math.random() * 1000)}ms`,
              }}
              key={tableRows.ID}
            >
              <div className="w-full input_box py-4 px-4 rounded-lg text-stone-500 text-xs flex items-center justify-start">
                <div
                  className="w-[6px] h-[6px] rounded-full"
                  style={{
                    backgroundColor: tableRows.isActive ? "green" : "red",
                  }}
                ></div>
                <p className="w-2/12">{tableRows.ID}</p>
                <p className="w-4/12">{tableRows.Name}</p>
                <p className="w-2/12">
                  {(tableRows.categoryName.length !== 2) ? tableRows.categoryName
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.substring(1)
                    )
                    .join(" ") : tableRows.categoryName.toUpperCase()}
                </p>
                <p className="w-2/12">
                  {tableRows.roleName
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.substring(1)
                    )
                    .join(" ")}
                </p>
                <p className="w-2/12">
                  {!tableRows.isActive ? "Inactive" : "Active"}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}

export default IndexPage;
