// For defining examples without account ID as its filled from jwt auth guard
type OmitAccountId<T> = Omit<T, 'accountId'>;