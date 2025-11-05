import React from "react";

import { AgreementCheckbox } from "../FormHelpers";

interface AgreementsSectionProps {
  agreedToPaymentTerms: boolean;
  agreedToDataSharing: boolean;
  onTogglePaymentTerms: () => void;
  onToggleDataSharing: () => void;
}

const AgreementsSection = ({
  agreedToPaymentTerms,
  agreedToDataSharing,
  onTogglePaymentTerms,
  onToggleDataSharing,
}: AgreementsSectionProps) => (
  <>
    <AgreementCheckbox
      label="Tôi đồng ý với điều khoản thanh toán và các phụ phí liên quan."
      checked={agreedToPaymentTerms}
      onToggle={onTogglePaymentTerms}
    />

    <AgreementCheckbox
      label="Tôi cho phép sử dụng thông tin đã cung cấp để xử lý đơn đặt và chăm sóc khách hàng."
      checked={agreedToDataSharing}
      onToggle={onToggleDataSharing}
    />
  </>
);

export default AgreementsSection;
