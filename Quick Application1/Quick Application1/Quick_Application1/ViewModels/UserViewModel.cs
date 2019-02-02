// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using DAL.Models;
using FluentValidation;
using Quick_Application1.Helpers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.ComponentModel;

namespace Quick_Application1.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }
        [DisplayName("Nombre de usuario")] 
        [Required(ErrorMessage = "Agrega el nombre de usuario"), StringLength(200, MinimumLength = 2, ErrorMessage = "El nombre de usuario debe tener entre 2 y 200 caracteres")]
        public string UserName { get; set; }

        public string FullName { get; set; }

        [Required(ErrorMessage = "Agrega un correo electrónico"), StringLength(200, ErrorMessage = "El correo electrónico es muy largo"), EmailAddress(ErrorMessage = "Agrega correctamente el correo electrónico")]
        public string Email { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }

        public bool IsEnabled { get; set; }

        public bool IsLockedOut { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[] Roles { get; set; }
    }




    ////Todo: ***Using DataAnnotations for validations until Swashbuckle supports FluentValidation***
    //public class UserViewModelValidator : AbstractValidator<UserViewModel>
    //{
    //    public UserViewModelValidator()
    //    {
    //        //Validation logic here
    //        RuleFor(user => user.UserName).NotEmpty().WithMessage("Username cannot be empty");
    //        RuleFor(user => user.Email).EmailAddress().NotEmpty();
    //        RuleFor(user => user.Password).NotEmpty().WithMessage("Password cannot be empty").Length(4, 20);
    //    }
    //}
}
