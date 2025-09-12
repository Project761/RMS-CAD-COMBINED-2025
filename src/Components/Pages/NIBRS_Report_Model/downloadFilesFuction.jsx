  const downloadFile = async (fileUrl) => {
        try {
            for (let i = 0; i < 1; i++) {

                const originalUrl = fileUrl[0];
                const lastSlashIndex = fileUrl[i].lastIndexOf('/');
                const updatedUrl = replaceDomain(originalUrl);
             

               
            }
        } catch (error) {
            console.log("🚀 ~ downloadFile ~ error:", error);
        }

       
    };