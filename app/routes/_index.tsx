import { Template } from "@prisma/client";
import { Link } from "@remix-run/react";

const IndexPage = () => {
  const exampleData: Template[] = [
    {
      ID: "T346934",
      categoryName: "production",
      Name: "Kill IT Guys",
      roleName: "production manager",
      isActive: true
    },
    {
      ID: "T346945",
      categoryName: "information technology",
      Name: "Protect IT Guys",
      roleName: "backend developer",
      isActive: false
    },
    {
      ID: "T346947",
      categoryName: "sales",
      Name: "Achieve Target or Ded",
      roleName: "sales representative",
      isActive: true
    },
    {
      ID: "T346943",
      categoryName: "sales",
      Name: "Achieve Target or Ded",
      roleName: "sales representative",
      isActive: true
    }
  ]
  return (
    <>
      <main className="w-full flex flex-col justify-between h-screen">
        <div className="mt-5">
          <Table tableData={exampleData} />
        </div>
        <div>
          <div className="m-12 flex mb-5">
            <input type="text" className="w-full input_box py-3 px-4 rounded-lg text-stone-500 text-xs" placeholder="Enter an Action" />
            <button className="submit_button ml-5 rounded-lg text-xs px-4 text-stone-500">Submit</button>
          </div>
          <p className="w-full text-center text-xs mb-5 text-stone-500 font-sans">DeltaActions | Delta #2</p>
        </div>
      </main>
    </>
  );
};

function Table({ tableData }: { tableData: Template[] }) {
  return <>
    {tableData.map(tableRows => {
      return (
        <Link to="kra/T913688" key={tableRows.ID}>
          <div className={`mx-12 my-2 text-center animate`} style={{
            animationDelay: `${Math.floor(Math.random() * 1000)}ms`
          }} key={tableRows.ID}>
            <div className="w-full input_box py-4 px-4 rounded-lg text-stone-500 text-xs flex items-center justify-start">
              <div className="w-[6px] h-[6px] rounded-full" style={{
                backgroundColor: (tableRows.isActive) ? "green" : "red"
              }}></div>
              <p className="w-2/12">{tableRows.ID}</p>
              <p className="w-4/12">{tableRows.Name}</p>
              <p className="w-2/12">{tableRows.categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
              <p className="w-2/12">{tableRows.roleName.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}</p>
              <p className="w-2/12">{(!tableRows.isActive) ? "Inactive" : "Active"}</p>
            </div>
          </div>
        </Link >
      )
    })}
  </>
}

export default IndexPage;
