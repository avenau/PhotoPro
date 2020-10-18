import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import Form from '../components/Form/Form';
import IFormProps from '../components/Form/IFormProps';

export default {
  title: 'Example/Form',
  component: Form,
} as Meta;

const Template: Story<IFormProps> = (args) => <Form {...args} />;

export const Title1 = Template.bind({});
Title1.args = {
  title: 't1',
};

export const Title2 = Template.bind({});
Title2.args = {
  title: 't2',
};

export const Title3 = Template.bind({});
Title3.args = {};
