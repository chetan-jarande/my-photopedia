import { useState } from "react";
import Layout from "@/components/Layout";
import { CustomBtn6 } from "@/components/utilityComponent/buttons/CustomButtons";
import { toast } from "react-toastify";
import DataRepresentation from "@/components/utilityComponent/DataRepresentation";
import { drivePhotographyFolderId } from "@/data/data";

const SyncDrive = () => {
  const folderId = drivePhotographyFolderId;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const handleSyncDriveButton = async () =>{
    setLoading(true);
    const response = await fetch(`/api/syncDrive?folderId=${folderId}`, {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      console.log("data: ", data);
      setData(data);
      // console.log('Data Updated successfully:', data);
      toast.success(`Data Updated successfully: ${data.message}.`, { autoClose: 10000 });
    } else {
      console.error(`Error Updating data | Status: ${response.statusText} | response:`,response );
      toast.error(`Error Updating data: ${data.message} `);
    }
    setLoading(false);
  }


  return (
    
    <Layout
      className={`flex items-center justify-center flex-col`}>
    
    <CustomBtn6 
        ButtonName={`${loading ? 'Syncing Drive...' : 'Sync Drive'}`}
        onClick={handleSyncDriveButton}
    />
      {data.message ? 
      <DataRepresentation
        data={data}
        />
      : null}

    </Layout>
  )
}

export default SyncDrive