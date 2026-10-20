# Data Model: Registro de Usuarios de KynWallet

This model describes transient UI data only. Registration does not persist an account or submit credentials to a backend.

## Registration Form Values

Represents the visitor's current form input.

| Field | Type | Required | Validation / handling |
|---|---|---:|---|
| `fullName` | String | Yes | Must contain non-whitespace content after trimming surrounding whitespace. No other name format or length limit is specified. |
| `email` | String | Yes | Must pass the existing normalized email validation; leading and trailing whitespace are ignored for validation. Existing rule limits normalized email to 254 characters. |
| `password` | String | Yes | At least 8 characters. Do not trim; spaces count as input. No maximum or composition rule is specified. |
| `confirmPassword` | String | Yes | Must exactly match `password`. Revalidate when either value changes. |
| `termsAccepted` | Boolean | Yes | Must be `true` before successful submission. |

`confirmPassword` exists only to validate the form. It is not a separate account attribute and neither password field is included in success output or persisted.

## Validation Errors

An ephemeral partial mapping from form field (and the terms acceptance control) to a user-facing message. Errors are computed by the pure registration validator and are displayed inline with accessible association to their controls. Invalid values block the success state.

## Registration Result

The form lifecycle is transient:

```text
idle -> invalid (inline errors) -> idle (corrected values)
idle -> success (all values valid and terms accepted)
```

`success` displays a non-sensitive confirmation and removes the form values from active form state. There is no network, persistence, account identity, or retry state in this feature scope.
