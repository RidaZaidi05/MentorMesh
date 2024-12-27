import  { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/toast';

const GroupsSearch = ({ onDataFetch }) => {
  const toast = useToast();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a fetch request to the backend API to search for users
        const response = await fetch(`${process.env.BACKEND_URL}/chats/OpenChat`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const fetchedData = await response.json();
        
        // Set the fetched data into state
        setData(fetchedData);
        // Pass the fetched data to the parent component
        onDataFetch(fetchedData);

      } catch (error) {
        console.error('Error searching for users:', error.message);
        toast({
          title: "Failed to fetch users",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
          size: "md",
        });
      }
    };

    fetchData();
  }, [onDataFetch, toast]);

  return null; // You can return any JSX here if needed
};

export default GroupsSearch;
