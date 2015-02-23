var abcBirthdayPicker = angular.module('abcBirthdayPicker', []);

abcBirthdayPicker.directive('abcBirthdayPicker', ['$timeout', function($timeout) {
    return {
        require: '?ngModel',
        scope: {
            user_option: '=abcBirthdayPicker'
        },
        link: function(scope, element, attrs, ngModelController) {
            scope._adjustModelDateFormat = function(date_string, date_format) {
                var year, month, day;
                if (date_string) {
                    date_string = date_string.split('-');
                    if (date_format == 'middleEndian') {
                        month = date_string[0];
                        day = date_string[1];
                        year = date_string[2];
                    } else if (date_format == 'littleEndian') {
                        day = date_string[0];
                        month = date_string[1];
                        year = date_string[2];
                    } else {
                        year = date_string[0];
                        month = date_string[1];
                        day = date_string[2];
                    }

                    date_string = year + '-' + month + '-' + day;
                }

                return date_string;
            };

            scope._adjustViewDateFormat = function(date_string, date_format) {
                var year, month, day;
                if (date_string) {
                    date_string = date_string.split('-');
                    year = date_string[0];
                    month = date_string[1];
                    day = date_string[2];

                    if (date_format == 'middleEndian') {
                        date_string = month + '-' + day + '-' + year;
                    } else if (date_format == 'littleEndian') {
                        date_string = day + '-' + month + '-' + year;
                    } else {
                        date_string = year + '-' + month + '-' + day;
                    }
                }

                return date_string;
            };

            scope.option = {
                dateFormat: 'middleEndian'
            };

            angular.extend(scope.option, scope.user_option);

            scope.onChange = function(hiddenData) {
                var el_month = element.find('.birth-month'),
                    el_day = element.find('.birth-day'),
                    el_year = element.find('.birth-year'),
                    el_birthdate = element.find('[name=birthdate]');

                if (el_month.val() && el_day.val() && el_year.val() && el_month.val() != '0' && el_day.val() != '0' && el_year.val() != '0') {
                    ngModelController.$setViewValue(
                        scope._adjustViewDateFormat(el_birthdate.val(), scope.option.dateFormat)
                    );
                } else {
                    ngModelController.$setViewValue(null);
                }
            }

            if (!scope.option.onChange) {
                scope.option.onChange = scope.onChange;
            } else {
                scope.option.onChange = function(hiddenData) {
                    scope.user_option.onChange(hiddenData);
                    scope.onChange(hiddenData);
                }
            }

            if (ngModelController) {
                ngModelController.$render = function() {
                    var default_date = ngModelController.$viewValue,
                        year, month, day;

                    if (default_date) {
                        angular.extend(scope.option, {
                            defaultDate: scope._adjustModelDateFormat(default_date, scope.option.dateFormat)
                        });
                    } else {
                        delete scope.option.defaultDate;
                    }
                    element.birthdaypicker(scope.option);
                };
            } else {
                element.birthdaypicker();
            }
        }
    }
}]);