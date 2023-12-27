import { AMEX } from 'assets/svgs/logos/amex';
import { Diners } from 'assets/svgs/logos/diners';
import { Discover } from 'assets/svgs/logos/discover';
import { JCB } from 'assets/svgs/logos/jcb';
import { Mastercard } from 'assets/svgs/logos/mastercard';
import { UnionPay } from 'assets/svgs/logos/union-pay';
import { VISA } from 'assets/svgs/logos/visa';

export const CardLogo = ({ brand }: { brand: string }) =>
  brand === 'visa'
    ? VISA
    : brand === 'mastercard'
      ? Mastercard
      : brand === 'amex'
        ? AMEX
        : brand === 'discover'
          ? Discover
          : brand === 'diners'
            ? Diners
            : brand === 'jcb'
              ? JCB
              : brand === 'union'
                ? UnionPay
                : VISA;
