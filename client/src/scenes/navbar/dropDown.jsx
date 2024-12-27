import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { InputBase } from "@mui/material";

function SearchList(props) {
  const theme = useTheme();
  const { searchData, onSelectGroup, onSelectTeacher, pageType } = props;
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setFilter(event.target.value.toUpperCase());
  };

  const handleSeeAllResults = () => {
    setFilter(''); // Clear the filter before navigating
    navigate(`/PeopleAndPosts?search=${filter}`);
  };

  const handleClick = (name) => {
    setFilter(''); // Clear the filter when an option is clicked
    if (pageType === 'home' || pageType === undefined || pageType === 'profile') {
      
      onSelectTeacher(name);
    } else if (pageType === 'chat') {
      onSelectGroup(name);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: '300px', marginTop: '3px', marginLeft: '3px', borderRadius: '20px', overflow: 'hidden' }}>
        <InputBase
          type="text"
          id="myInput"
          value={filter}  // Bind the input value to the filter state
          onChange={handleInputChange}
          placeholder="Search for names.."
          title="Type in a name"
          autoComplete="off"
          style={{
            width: '100%',
            padding: '8px 12px 8px 20px',
            borderRadius: '20px',
            border: `1px solid ${theme.palette.neutral.light}`,
            backgroundColor: theme.palette.neutral.light,
            outline: 'none',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
        {filter && (
          <ul style={{ listStyleType: 'none', padding: '0', marginTop: '10px', borderRadius: '20px', overflow: 'hidden', position: 'absolute', zIndex: 5000, backgroundColor: theme.palette.background.default, boxShadow: '0px 0px 5px rgba(16, 144, 223, 0.1)' }}>
            {searchData
              .filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
              .slice(0, 10)
              .map((name, index) => (
                <li key={index} style={{ width: '100%' }}>
                  <a
                    href="#"
                    style={{
                      display: 'block',
                      padding: '8px',
                      width: '300px',
                      textDecoration: 'none',
                      color: theme.palette.default,
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#87CEEB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={() => handleClick(name)}
                  >
                    {name}
                  </a>
                </li>
              ))}
            {(pageType === 'home' || pageType === 'profile') && (
              <li>
                <a
                  href="#"
                  style={{
                    padding: '8px',
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    color: theme.palette.default,
                    textDecoration: 'none',
                    transition: 'color 0.3s ease, text-decoration 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  onClick={handleSeeAllResults}
                >
                  See All Results
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchList;
