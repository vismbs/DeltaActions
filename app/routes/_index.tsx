import { Template } from "@prisma/client";
import {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
  json,
} from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import PromptBar from "~/components/PromptBar";
import { openAI } from "~/services/openai.server";
import { serverAPI } from "~/services/router.server";
import { Action, methodList } from "~/utils/appDeco";
let logMessage = "Functions Initialized";

class AIFunctions {
  constructor() {
    if (!(process.env.NODE_ENV === "production"))
      console.info("Functions Initialized");
  }

  @Action(
    "adds a template to the database and takes in template name, category name and a role name as arguments"
  )
  async addTemplate(templateName: string, categoryName: string, roleName: string) {
    const ID = `T${Math.floor(Math.random() * 10000)}`;
    const addedTemplate: Template | string = await serverAPI.addTemplate({
      tempCategory: categoryName,
      tempName: templateName,
      tempRole: roleName,
      tempID: ID,
    });

    if (typeof addedTemplate === "string") {
      logMessage = "Category Not Found"
      return;
    } else {
      return addedTemplate;
    }
  }

  @Action("deletes a template and takes in a template id")
  async deleteTemplate(templateID: string) {
    const deletedTemplate = serverAPI.deleteTemplate({
      templateID
    })

    return deletedTemplate;
  }

  @Action("updates the title of a template and takes in a template title and template id")
  async updateTitle(templateTitle: string, templateID: string) {
    const updatedTemplate = serverAPI.editTemplateName({
      templateID: templateID,
      templateName: templateTitle,
    })

    return updatedTemplate
  }

  @Action("updates the category and the role of a template and takes in a template category name, template role name and template id")
  async updateCategoryAndRole(templateCategory: string, templateRole: string, templateID: string) {

    const getCategory = await serverAPI.getCategory({
      categoryName: templateCategory
    })

    const existRole = getCategory?.Roles.filter(getRole => {
      return getRole.Name.trim() == templateRole
    })

    if (existRole!.length === 0) {
      logMessage = "Incorrect Role for the Given Category"
      return;
    } else {
      const updatedTemplate = serverAPI.editTemplateCategory({
        templateID: templateID,
        templateCategory: templateCategory,
        templateRole: templateRole
      })

      return updatedTemplate
    }
  }

  @Action("updates the role of a template and takes in a template role name and template id")
  async updateRole(templateRole: string, templateID: string) {

    const getTemplate = await serverAPI.getSingleTemplate({
      templateID: templateID
    })

    const associatedRoles = getTemplate!.Category.Roles.map(categRole => {
      return categRole.Name
    })

    const presentRole = associatedRoles.filter(associatedRole => {
      return associatedRole == templateRole
    })

    if (presentRole.length === 0) {
      logMessage = "Incorrect Role"
      return
    } else {
      const updatedTemplate = serverAPI.editTemplateRole({
        templateID: templateID,
        templateRole: templateRole,
      })

      return updatedTemplate
    }
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


  let isNotAFunction = false;

  if (evalFunction.data.choices[0].text?.trim() === "NO_FUNCTION_FOUND") {
    isNotAFunction = true;
    logMessage = "Invalid Action";
  }
  else {
    try {
      eval(`UserInstance.${evalFunction.data.choices[0].text?.trim().replace("\n", "")}`);
    } catch (error) {
      if (error instanceof ReferenceError) {
        logMessage = "Non-Existent Role"
      } else {
        console.error(error);
      }
    }
  }

  return json({
    isNotAFunction
  });
}



const IndexPage = () => {
  const { existingTemplates }: { existingTemplates: Template[] } =
    useLoaderData<typeof loader>();

  const actionData = useActionData();
  return (
    <>
      <main className="w-full flex flex-col justify-between h-screen">
        <div className="mt-5">
          <Table tableData={existingTemplates} />
        </div>
        <div>
          <PromptBar actionRoute="?index" isNotAFunction={actionData?.isNotAFunction} logMessage={logMessage} />
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
