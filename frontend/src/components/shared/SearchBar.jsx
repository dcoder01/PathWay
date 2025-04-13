import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

const SearchBar = ({ settingInput, input, text }) => {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <Input
          className="pl-10 w-full"
          placeholder={text}
          value={input}
          onChange={(e) => settingInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
