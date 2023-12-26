// FirmPicker.tsx

import React from 'react';
import { View, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface Firm {
  firm_id: number;
  firm_name: string;
  address: string;
  mobile: number;
  registration: string;
  contact_person: string;
  email: string;
  website: string;
}

interface FirmPickerProps {
  firms: Firm[];
  selectedFirmId: number | null;
  onFirmChange: (selectedFirmId: number, selectedFirmName: string) => void;
}

const FirmPicker: React.FC<FirmPickerProps> = ({
  firms,
  selectedFirmId,
  onFirmChange,
}) => {
  return (
    <View>
      <Text>Select Firm:</Text>
      <Picker
        selectedValue={selectedFirmId}
        onValueChange={(itemValue, itemIndex) => {
          const selectedFirm = firms[itemIndex];
          onFirmChange(selectedFirm.firm_id, selectedFirm.firm_name);
        }}>
        {firms.map((firm, index) => (
          <Picker.Item key={index} label={firm.firm_name} value={firm.firm_id} />
        ))}
      </Picker>
    </View>
  );
};

export default FirmPicker;
