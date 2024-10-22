import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";

const useContacts = () => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getContactsPermission = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        console.log(status);
        setPermissionGranted(true);
      }
    };

    getContactsPermission();
  }, []);

  const getContacts = async () => {
    if (permissionGranted) {
      const { data } = await Contacts.getContactsAsync();
      console.log("data from hook", data);
      setContacts(data);
      // if (data.length > 0) {
      //   setContacts(data);
      // }
    }
  };

  return { contacts, getContacts };
};

export default useContacts;
