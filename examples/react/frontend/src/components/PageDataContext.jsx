import React, { createContext, useContext, useState, useEffect } from "react";

const PageDataContext = createContext();

export function usePageData() {
  return useContext(PageDataContext);
}

export function PageDataProvider({ children }) {
  const [pageData, setPageData] = useState(null);
  const [userDeviceId, setUserDeviceId] = useState(() => {
    // Retrieve userDeviceId from local storage or generate a new one
    return localStorage.getItem("userDeviceId") || qeen.randInt();
  });

  useEffect(() => {
    // Store userDeviceId in local storage
    localStorage.setItem("userDeviceId", userDeviceId);
    console.log("userDeviceId", userDeviceId);

    qeen
      .fetchQeenContent(
        userDeviceId,
        "http://localhost:4000/contentconfig/config.json"
      )
      .then((fetchedPageData) => {
        setPageData(fetchedPageData);
        qeen.initPageSession(fetchedPageData);
      })
      .catch(() => {
        setPageData(null);
      });
  }, [userDeviceId]);

  return (
    <PageDataContext.Provider value={{ pageData }}>
      {children}
    </PageDataContext.Provider>
  );
}
