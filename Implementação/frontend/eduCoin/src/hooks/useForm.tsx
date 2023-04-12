import { useState } from "react";

export function useForm(
  initialFValues: any,
  validations: any,
  editId?: any
) {
  const [values, setValues] = useState<T>(initialFValues);
  const [errors, setErrors] = useState<any>({});
  const [formEditId] = useState(editId);

  const isEdit = formEditId != undefined;

  type FieldErrors = {
    [key: string]: string;
  };

  // handler de onChange pra Textfields, Radios e Checkboxes
  const handleChange = (prop: any) => (event: any) => {
    let newVal;

    if (event?.target != undefined) {
      newVal =
        event.target.type == "checkbox"
          ? event.target.checked
          : event.target.value;
    } else {
      newVal = event;
    }

    setValues({ ...values, [prop]: newVal });
  };

  const setError = (prop: string, error: string) => {
    setErrors((prev: any) => ({
      ...prev,
      [prop]: error,
    }));
  };

  function getFieldErrors(objError) {
    //     const errorsRes: FieldErrors = {};
    //     if (objError.error) {
    //       objError.error.details.forEach((err) => {
    //         errorsRes[err.path.join(".")] = err.message;
    //       });
    //     }
    //     return errorsRes;
    //   }
    //   const resetForm = () => {
    //     setValues(initialFValues);
    //     setErrors({});
  }

  const formValidate = (arg?: any, additionalValidation?: any) => {
    //   const validationSchema = !!arg ? validations(arg) : validations
    //   const schema = Joi.object(validationSchema).messages({
    //     'number.base': `Este campo é obrigatório`,
    //     'string.base': `Este campo é obrigatório`,
    //     'string.empty': `Este campo é obrigatório`,
    //     'any.required': `Este campo é obrigatório`,
    //     'string.max': `Este campo deve ter um máximo de {#limit} caracteres`,
    //     'number.max': `Este campo deve ter um valor máximo de {#limit}`,
    //     'number.integer': `Este campo deve conter um número inteiro`,
    //     'date.base': `Este campo é obrigatório`,
    //     'string.email': `Email inválido`
    //   })
    //   const formErrors = getFieldErrors(schema.validate(values, { abortEarly: false, allowUnknown: true }))
    //   if (Object.keys(formErrors).length != 0) {
    //     toast.error('Preencha corretamente os dados do formulário')
    //     setErrors(formErrors)
    //     return false // has error
    //   }
    //   if (!!additionalValidation && !additionalValidation(values)) return false
    //   setErrors({})
    //   return true
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    formValidate,
    handleChange,
    formEditId,
    setError,
    isEdit,
  };
}
