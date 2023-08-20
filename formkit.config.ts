/* eslint-disable quote-props */
import type { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const config: DefaultConfigOptions = {
  theme: 'genesis',
  config: {
    classes: generateClasses({
      global: {
        wrapper: 'flex items-center',
        input: ' formkit-invalid:border formkit-invalid:border-red-400 ',
        label: '$reset inline-block w-24',
      },
      checkbox: {
        fieldset: '$reset flex items-start',
        options: 'inline-block',
        legend: '$reset w-24',
      },
      'family:button': {
        input: '$reset inline-flex justify-center items-center btn bg-secondary-100 text-white focus-visible:outline-2 focus-visible:outline-secondary-200 focus-visible:outline-offset-2 formkit-disabled:bg-gray-400 formkit-loading:before:w-4 formkit-loading:before:h-4 formkit-loading:before:mr-2 formkit-loading:before:border formkit-loading:before:border-2 formkit-loading:before:border-r-transparent formkit-loading:before:rounded-3xl formkit-loading:before:border-white formkit-loading:before:animate-spin',
      },
      'family:dropdown': {},
      'family:text': {},
      'text': {},
      'password': {},
      'url': {},
    }),
  },
}

export default config