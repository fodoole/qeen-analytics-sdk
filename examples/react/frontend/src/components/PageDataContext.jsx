import React, { createContext, useContext, useState, useEffect } from 'react';

const PageDataContext = createContext();
let UserDeviceId = function () {
  const min = 1;
  const max = Math.pow(10, 16) - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

export function usePageData() {
  return useContext(PageDataContext);
}

export function PageDataProvider({ children }) {
  const [pageData, setPageData] = useState(null);
  const [userDeviceId, setUserDeviceId] = useState(() => {
    // Retrieve userDeviceId from local storage or generate a new one
    return localStorage.getItem('userDeviceId') || UserDeviceId();
  });

  useEffect(() => {
    // Store userDeviceId in local storage
    localStorage.setItem('userDeviceId', userDeviceId);
    console.log("userDeviceId", userDeviceId);

    qeen
      .fetchQeenContent(userDeviceId, "http://localhost:4000/contentconfig/config.json")
      .then((fetchedPageData) => {
        setPageData(fetchedPageData);
        qeen.initPageSession(fetchedPageData);
      })
      .catch((error) => {
        console.error(error);
        setPageData(null);
      });
  }, [userDeviceId]);

  return (
    <PageDataContext.Provider value={{ pageData }}>
      {children}
    </PageDataContext.Provider>
  );
}